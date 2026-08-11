import {createHash} from 'node:crypto';

import {intermineConstraint, interminePathQuery} from '../intermine.server.js';

export type IntermineSequenceRecord = {
  gene: string;
  type: string;
  residues: string;
  length: number;
  md5checksum: string;
};

// Per-side genomic flank cap (bases).
const MAX_FLANK = 10000;

const md5 = (residues: string): string =>
  createHash('md5').update(residues).digest('hex');

// Upper-case is canonical: consistent across types, md5-stable (refget/SAM-M5
// convention), and InterMine's lower-case FASTA export carries no soft-mask
// info. length/md5 derived here — genomic sequence has no stored md5.
const toRecord = (
  gene: string,
  type: string,
  residues: string,
): IntermineSequenceRecord => {
  const canonical = residues.toUpperCase();
  return {
    gene,
    type,
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
  return toRecord(identifier, type.toLowerCase(), residues);
}

// Gene span (bp) from a FASTA header's `SEQID:START-END` region token.
function geneSpanFromHeader(header: string): number | null {
  const m = header.match(/:(\d+)-(\d+)/);
  return m ? Number(m[2]) - Number(m[1]) + 1 : null;
}

// Flank present on each end of the extended FASTA (gene orientation) when
// `extension` is clipped at a chromosome boundary. Needs strand + coordinates.
async function geneFlankExtents(
  this: {pathQuery: (query: string) => Promise<{results: unknown[][]}>},
  identifier: string,
  extension: number,
): Promise<{leading: number; trailing: number} | null> {
  const query = interminePathQuery(
    [
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
  const [start, end, strand, chromLength] = results[0] as [
    number,
    number,
    string,
    number,
  ];
  const low = Math.min(extension, start - 1); // bases below the gene
  const high = Math.min(extension, chromLength - end); // bases above the gene
  return String(strand) === '-1'
    ? {leading: high, trailing: low}
    : {leading: low, trailing: high};
}

// Genomic via FASTA export: extension = max(up, down) adds a symmetric flank
// (0 = bare gene), trimmed to asymmetric up/down. InterMine yields gene
// orientation, so `up` leads and `down` trails on either strand. Near a
// chromosome end the flank is clipped shorter than `extension`; the header's
// gene span reveals it, and only then do we fetch coordinates to trim exactly.
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
  const constraints = [
    intermineConstraint('Gene.primaryIdentifier', '=', identifier),
  ];
  const extension = Math.max(up, down);
  const query = interminePathQuery(
    ['Gene.primaryIdentifier'],
    'Gene.primaryIdentifier',
    constraints,
  );
  const fasta = await this.pathQueryFasta(query, extension);
  // one FASTA record: header, then sequence lines up to the next `>`
  const lines = fasta.split('\n');
  const headerIdx = lines.findIndex((line) => line.startsWith('>'));
  const header = headerIdx < 0 ? '' : lines[headerIdx];
  const body: string[] = [];
  for (const line of lines.slice(headerIdx + 1)) {
    if (line.startsWith('>')) break;
    if (line) body.push(line);
  }
  const residues = body.join('');
  if (!residues) return null;

  let front = extension - up;
  let back = extension - down;
  const geneSpan = geneSpanFromHeader(header);
  if (
    extension > 0 &&
    geneSpan !== null &&
    residues.length < geneSpan + 2 * extension
  ) {
    const flanks = await geneFlankExtents.call(this, identifier, extension);
    if (flanks) {
      front = Math.max(0, flanks.leading - up);
      back = Math.max(0, flanks.trailing - down);
    }
  }
  const trimmed = residues.slice(front, residues.length - back);
  return toRecord(identifier, 'genome', trimmed);
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
