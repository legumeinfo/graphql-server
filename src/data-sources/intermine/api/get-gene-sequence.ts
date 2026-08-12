import {createHash} from 'node:crypto';

import {intermineConstraint, interminePathQuery} from '../intermine.server.js';

export type IntermineSequenceRecord = {
  gene: string;
  type: string;
  header: string;
  residues: string;
  length: number;
  md5checksum: string;
};

// Per-side genomic flank cap (bases).
const MAX_FLANK = 10000;

const md5 = (residues: string): string =>
  createHash('md5').update(residues).digest('hex');

// InterMine strand is '1' / '-1' / '0'.
const strandSign = (strand: string): string =>
  strand === '1' ? '+' : strand === '-1' ? '-' : '.';

// Upper-case is canonical: consistent across types, md5-stable (refget/SAM-M5
// convention), and InterMine's lower-case FASTA export carries no soft-mask
// info. length/md5 derived here — genomic sequence has no stored md5.
const toRecord = (
  gene: string,
  type: string,
  header: string,
  residues: string,
): IntermineSequenceRecord => {
  const canonical = residues.toUpperCase();
  return {
    gene,
    type,
    header,
    residues: canonical,
    length: canonical.length,
    md5checksum: md5(canonical),
  };
};

// Protein/CDS: the gene's child feature holds the Sequence. Select the
// annotation's primary isoform (`isPrimary`), else the first.
async function geneChildSequence(
  this: {pathQuery: (query: string) => Promise<{results: unknown[][]}>},
  identifier: string,
  type: 'PROTEIN' | 'CDS',
): Promise<IntermineSequenceRecord | null> {
  const collection = type === 'PROTEIN' ? 'proteins' : 'CDSs';
  const view = [
    `Gene.${collection}.primaryIdentifier`,
    `Gene.${collection}.isPrimary`,
    `Gene.${collection}.sequence.residues`,
  ];
  const constraints = [
    intermineConstraint('Gene.primaryIdentifier', '=', identifier),
  ];
  const query = interminePathQuery(
    view,
    `Gene.${collection}.primaryIdentifier`,
    constraints,
  );
  const {results} = await this.pathQuery(query);
  if (!results.length) return null;
  const preferred = results.find((row) => row[1] === true) ?? results[0];
  const residues = preferred[2] as string | null;
  if (!residues) return null;
  const isoform = preferred[0] as string; // the sequence's own accession
  const seqType = type.toLowerCase();
  // FASTA convention: id token names the record's sequence, gene in description.
  const header = `${isoform} ${seqType} gene=${identifier}`;
  return toRecord(identifier, seqType, header, residues);
}

// Gene's genomic location + chromosome, for flank trimming and the header.
async function geneLocation(
  this: {pathQuery: (query: string) => Promise<{results: unknown[][]}>},
  identifier: string,
): Promise<{
  seqid: string;
  start: number;
  end: number;
  strand: string;
  chromLength: number;
} | null> {
  const query = interminePathQuery(
    [
      'Gene.chromosome.primaryIdentifier',
      'Gene.chromosomeLocation.start',
      'Gene.chromosomeLocation.end',
      'Gene.chromosomeLocation.strand',
      'Gene.chromosome.length',
    ],
    // sort path must be in the view, else InterMine 500s
    'Gene.chromosomeLocation.start',
    [intermineConstraint('Gene.primaryIdentifier', '=', identifier)],
  );
  const {results} = await this.pathQuery(query);
  if (!results.length) return null;
  const [seqid, start, end, strand, chromLength] = results[0] as [
    string,
    number,
    number,
    string,
    number,
  ];
  return {seqid, start, end, strand: String(strand), chromLength};
}

// Genomic via FASTA export: extension = max(up, down) adds a symmetric flank
// (0 = bare gene), trimmed to asymmetric up/down. InterMine yields gene
// orientation, so `up` leads and `down` trails on either strand; near a contig
// end the flank clips short, so we trim by the coordinates, not by `extension`.
// The header carries reference-coordinate provenance (seqid:start-end, strand,
// requested flanks).
async function geneGenomeSequence(
  this: {
    pathQuery: (query: string) => Promise<{results: unknown[][]}>;
    pathQueryFasta: (query: string, extension: number) => Promise<string>;
  },
  identifier: string,
  up: number,
  down: number,
): Promise<IntermineSequenceRecord | null> {
  up = Math.min(Math.max(0, up), MAX_FLANK);
  down = Math.min(Math.max(0, down), MAX_FLANK);
  const loc = await geneLocation.call(this, identifier);
  if (!loc) return null;
  const {seqid, start, end, strand, chromLength} = loc;
  const start0 = start - 1; // 0-based
  const negative = strand === '-1';

  const extension = Math.max(up, down);
  const query = interminePathQuery(
    ['Gene.primaryIdentifier'],
    'Gene.primaryIdentifier',
    [intermineConstraint('Gene.primaryIdentifier', '=', identifier)],
  );
  const fasta = await this.pathQueryFasta(query, extension);
  // one FASTA record: header line, then sequence lines up to the next `>`
  const lines = fasta.split('\n');
  const headerIdx = lines.findIndex((line) => line.startsWith('>'));
  const body: string[] = [];
  for (const line of lines.slice(headerIdx + 1)) {
    if (line.startsWith('>')) break;
    if (line) body.push(line);
  }
  const residues = body.join('');
  if (!residues) return null;

  // Flank actually present on each end of the extended export (clipped at
  // contig ends), then trim down to up/down. up leads, down trails.
  const lowAvail = Math.min(extension, start0);
  const highAvail = Math.min(extension, chromLength - end);
  const leadingAvail = negative ? highAvail : lowAvail;
  const trailingAvail = negative ? lowAvail : highAvail;
  const front = Math.max(0, leadingAvail - up);
  const back = Math.max(0, trailingAvail - down);
  const trimmed = residues.slice(front, residues.length - back);

  // Reference coords: low boundary clamped at 0, high = low + returned length.
  const lowBudget = negative ? down : up;
  const fetchStart = Math.max(0, start0 - lowBudget);
  const fetchEnd = fetchStart + trimmed.length;
  const header =
    `${seqid}:${fetchStart}-${fetchEnd} genome gene=${identifier} ` +
    `strand=${strandSign(strand)} flanks=${up}/${down}`;
  return toRecord(identifier, 'genome', header, trimmed);
}

// Resolve a gene's protein/CDS/genomic sequence from InterMine. up/down are
// genomic flanks (GENOME only).
export async function getGeneSequence(
  this: {
    pathQuery: (query: string) => Promise<{results: unknown[][]}>;
    pathQueryFasta: (query: string, extension: number) => Promise<string>;
  },
  identifier: string,
  type: 'PROTEIN' | 'CDS' | 'GENOME',
  up = 0,
  down = 0,
): Promise<IntermineSequenceRecord | null> {
  if (type === 'GENOME') {
    return geneGenomeSequence.call(this, identifier, up, down);
  }
  return geneChildSequence.call(this, identifier, type);
}
