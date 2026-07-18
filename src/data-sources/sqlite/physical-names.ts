// physical-names.ts — InterMine Postgres physical naming, VERIFIED against the
// glycinemine-5104 pg_dump (208 tables = 100 class + 108 indirection).
//   class -> table: lower-case | attr -> col: lower-case | ref -> col: name+"id"
//   PK "id"; inherited attrs flattened onto leaf tables.
// InterMine prefixes any reserved-word identifier — table OR column — with
// `intermine_`. For tables this bites exactly one class in this model: Sequence
// (SQL reserved word) -> `intermine_sequence`. Verified against the mirror: it is
// the only class table so prefixed (`intermine_metadata` is an InterMine internal,
// not a model class). Add to this set if a future mine surfaces another.
const RESERVED_TABLES = new Set(['sequence']);
export const tableOf = (cls: string): string => {
  const n = cls.toLowerCase();
  return RESERVED_TABLES.has(n) ? `intermine_${n}` : n;
};
// InterMine prefixes reserved-word attribute columns with `intermine_`
// (verified in pg_dump: value, start, end, position, size, date, year, month, alias).
// Exported so a conformance test can assert the DB introduces no reserved word we
// don't know about.
export const RESERVED_ATTRS = new Set([
  'alias',
  'date',
  'end',
  'month',
  'position',
  'size',
  'start',
  'value',
  'year',
]);
export const attrCol = (name: string): string => {
  const n = name.toLowerCase();
  return RESERVED_ATTRS.has(n) ? `intermine_${n}` : n;
};
export const refCol = (name: string): string => name.toLowerCase() + 'id';
export const PK = 'id';

// synonym table backs LOOKUP. NOTE: value column is `intermine_value` (not `value`).
export const SYNONYM_TABLE = 'synonym';
export const SYNONYM_VALUE_COL = 'intermine_value';
export const SYNONYM_SUBJECT_COL = 'subjectid';

export type IndirectionSpec = {table: string; nearCol: string; farCol: string};

// Derive an m2m indirection spec from the InterMine physical naming rule (verified
// against the mirror across all 343 m2m collections):
//   farCol  = the collection's own name, lowercased
//   nearCol = the reverse-reference collection name, or — for a UNIDIRECTIONAL
//             collection — the class that DECLARES it (see Model.declaringClass),
//             lowercased
//   table   = the two column names, sorted and concatenated
// The two directions of a bidirectional m2m therefore land on the same table with
// nearCol/farCol swapped. Pass the resolved near name (reverseReference ??
// declaringClass) — this stays model-agnostic.
export const deriveIndirection = (
  collection: string,
  nearName: string,
): IndirectionSpec => {
  const farCol = collection.toLowerCase();
  const nearCol = nearName.toLowerCase();
  return {table: [nearCol, farCol].sort().join(''), nearCol, farCol};
};

// Verified overrides. The rule above (deriveIndirection) reproduces every one of
// these exactly, so they are redundant for this mine and kept only as a pin: an
// explicit spec here wins over the derivation, for a future mine that deviates.
// Originally auto-derived from the glycinemine-5104 pg_dump.
export const INDIRECTION: Record<string, IndirectionSpec> = {
  'Author.publications': {
    table: 'authorspublications',
    nearCol: 'authors',
    farCol: 'publications',
  },
  'DataSet.entities': {
    table: 'datasetsentities',
    nearCol: 'datasets',
    farCol: 'entities',
  },
  'Exon.transcripts': {
    table: 'exonstranscripts',
    nearCol: 'exons',
    farCol: 'transcripts',
  },
  'GWASResult.markers': {
    table: 'gwasresultsmarkers',
    nearCol: 'gwasresults',
    farCol: 'markers',
  },
  'Gene.geneFamilyAssignments': {
    table: 'genegenefamilyassignments',
    nearCol: 'gene',
    farCol: 'genefamilyassignments',
  },
  'Gene.geneFunctions': {
    table: 'genegenefunctions',
    nearCol: 'gene',
    farCol: 'genefunctions',
  },
  'Gene.panGeneSets': {
    table: 'genespangenesets',
    nearCol: 'genes',
    farCol: 'pangenesets',
  },
  'Gene.pathways': {
    table: 'genespathways',
    nearCol: 'genes',
    farCol: 'pathways',
  },
  'Gene.proteinDomains': {
    table: 'genesproteindomains',
    nearCol: 'genes',
    farCol: 'proteindomains',
  },
  'Gene.proteins': {
    table: 'genesproteins',
    nearCol: 'genes',
    farCol: 'proteins',
  },
  'GeneFamily.proteinDomains': {
    table: 'genefamiliesproteindomains',
    nearCol: 'genefamilies',
    farCol: 'proteindomains',
  },
  'GeneFunction.gene': {
    table: 'genegenefunctions',
    nearCol: 'genefunctions',
    farCol: 'gene',
  },
  'GeneFunction.publications': {
    table: 'entitiespublications',
    nearCol: 'entities',
    farCol: 'publications',
  },
  'GeneFunction.trait': {
    table: 'genefunctionstrait',
    nearCol: 'genefunctions',
    farCol: 'trait',
  },
  'GeneticMarker.genotypingPlatforms': {
    table: 'genotypingplatformsmarkers',
    nearCol: 'markers',
    farCol: 'genotypingplatforms',
  },
  'GeneticMarker.gwasResults': {
    table: 'gwasresultsmarkers',
    nearCol: 'markers',
    farCol: 'gwasresults',
  },
  'GeneticMarker.qtls': {
    table: 'markersqtls',
    nearCol: 'markers',
    farCol: 'qtls',
  },
  'GenotypingPlatform.markers': {
    table: 'genotypingplatformsmarkers',
    nearCol: 'genotypingplatforms',
    farCol: 'markers',
  },
  'IntergenicRegion.adjacentGenes': {
    table: 'adjacentgenesintergenicregion',
    nearCol: 'intergenicregion',
    farCol: 'adjacentgenes',
  },
  'Intron.genes': {table: 'genesintrons', nearCol: 'introns', farCol: 'genes'},
  'Intron.transcripts': {
    table: 'intronstranscripts',
    nearCol: 'introns',
    farCol: 'transcripts',
  },
  'Location.dataSets': {
    table: 'datasetslocation',
    nearCol: 'location',
    farCol: 'datasets',
  },
  'Ontology.dataSets': {
    table: 'datasetsontology',
    nearCol: 'ontology',
    farCol: 'datasets',
  },
  'OntologyAnnotation.dataSets': {
    table: 'datasetsontologyannotation',
    nearCol: 'ontologyannotation',
    farCol: 'datasets',
  },
  'OntologyTerm.dataSets': {
    table: 'datasetsontologyterm',
    nearCol: 'ontologyterm',
    farCol: 'datasets',
  },
  'Organism.dataSets': {
    table: 'datasetsorganism',
    nearCol: 'organism',
    farCol: 'datasets',
  },
  'PanGeneSet.genes': {
    table: 'genespangenesets',
    nearCol: 'pangenesets',
    farCol: 'genes',
  },
  'PanGeneSet.proteins': {
    table: 'pangenesetsproteins',
    nearCol: 'pangenesets',
    farCol: 'proteins',
  },
  'PanGeneSet.transcripts': {
    table: 'pangenesetstranscripts',
    nearCol: 'pangenesets',
    farCol: 'transcripts',
  },
  'Pathway.genes': {
    table: 'genespathways',
    nearCol: 'pathways',
    farCol: 'genes',
  },
  'Protein.geneFamilyAssignments': {
    table: 'genefamilyassignmentsprotein',
    nearCol: 'protein',
    farCol: 'genefamilyassignments',
  },
  'Protein.genes': {
    table: 'genesproteins',
    nearCol: 'proteins',
    farCol: 'genes',
  },
  'Protein.panGeneSets': {
    table: 'pangenesetsproteins',
    nearCol: 'proteins',
    farCol: 'pangenesets',
  },
  'ProteinDomain.geneFamilies': {
    table: 'genefamiliesproteindomains',
    nearCol: 'proteindomains',
    farCol: 'genefamilies',
  },
  'ProteinDomain.genes': {
    table: 'genesproteindomains',
    nearCol: 'proteindomains',
    farCol: 'genes',
  },
  'Publication.authors': {
    table: 'authorspublications',
    nearCol: 'publications',
    farCol: 'authors',
  },
  'Publication.entities': {
    table: 'entitiespublications',
    nearCol: 'publications',
    farCol: 'entities',
  },
  'QTL.genes': {table: 'genesqtl', nearCol: 'qtl', farCol: 'genes'},
  'QTL.markers': {table: 'markersqtls', nearCol: 'qtls', farCol: 'markers'},
  'SequenceFeature.childFeatures': {
    table: 'childfeaturessequencefeature',
    nearCol: 'sequencefeature',
    farCol: 'childfeatures',
  },
  'Strain.dataSets': {
    table: 'datasetsstrain',
    nearCol: 'strain',
    farCol: 'datasets',
  },
  'Trait.dataSets': {
    table: 'datasetsentities',
    nearCol: 'entities',
    farCol: 'datasets',
  },
  'Trait.geneFunctions': {
    table: 'genefunctionstrait',
    nearCol: 'trait',
    farCol: 'genefunctions',
  },
  'Trait.publications': {
    table: 'entitiespublications',
    nearCol: 'entities',
    farCol: 'publications',
  },
  'Transcript.UTRs': {
    table: 'transcriptsutrs',
    nearCol: 'transcripts',
    farCol: 'utrs',
  },
  'Transcript.exons': {
    table: 'exonstranscripts',
    nearCol: 'transcripts',
    farCol: 'exons',
  },
  'Transcript.introns': {
    table: 'intronstranscripts',
    nearCol: 'transcripts',
    farCol: 'introns',
  },
  'Transcript.panGeneSets': {
    table: 'pangenesetstranscripts',
    nearCol: 'transcripts',
    farCol: 'pangenesets',
  },
  'UTR.transcripts': {
    table: 'transcriptsutrs',
    nearCol: 'utrs',
    farCol: 'transcripts',
  },
};

// Collections with no indirection table in this mine -> resolve to empty. Declared
// on the class that DEFINES the collection; the resolver also treats every subclass
// as absent (e.g. this covers Gene.overlappingFeatures, not just SequenceFeature's).
export const ABSENT_COLLECTIONS = new Set<string>([
  'SequenceFeature.overlappingFeatures',
]);
