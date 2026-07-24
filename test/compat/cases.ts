// cases.ts — the compatibility matrix. Add a row to grow coverage; the same row
// runs against both backends. Keep pageSize small so live comparisons stay cheap
// and deterministic. `skip` documents a known, accepted divergence.
//
// `args` is POSITIONAL — an array matching the method signature: searchGenes takes
// one options object ([{...}]); getAuthor takes two ([first, last]); getStrain one
// ([identifier]). See backends.ts `call`.
//
// Values here are tied to the mine named in TESTING.md (minimine-genefunction).
// A case whose reference returns zero rows proves nothing — both backends agree
// on "nothing" — so the suite fails any case that comes back empty unless it sets
// `allowEmpty` (see compat.test.ts). After pointing at a different mine, run
// `bun run test/compat/triage.ts` to find the rows that went hollow.
import type {CompareOptions} from './canonical.js';

export interface CompatCase {
  name: string;
  method: string; // a method name on both backends
  args: unknown[]; // positional arguments
  compare?: CompareOptions; // per-case overrides
  skip?: string; // reason (still recorded, but assertion skipped)
  // Set only for cases that assert emptiness on purpose. Without it, an empty
  // reference fails the case rather than passing vacuously.
  allowEmpty?: true;
  // get-one methods return a single object (or null), not a list. The comparison
  // engine wraps a scalar as a one-row list; this flags the intent and lets the
  // vacuous-guard treat a present object as non-empty.
  single?: true;
  // The method returns a bare value (not an ApiResponse) — e.g.
  // getSynonymsForGeneFunction returns string[]. Compare it directly (deep-equal)
  // rather than through the row-diff engine.
  raw?: true;
}

// `dataSetName` is populated out-of-band rather than from the view (see the
// commented-out `GeneFunction.dataSets.name` in models/gene-function.ts), so it
// is absent on both backends. Ignored explicitly so the intent is on the record.
const IGNORE_GF = {ignoreKeys: ['dataSetName']};

export const cases: CompatCase[] = [
  // ---- searchGenes ----------------------------------------------------------
  // Single-constraint coverage, one per SearchGenesOptions field.
  {
    name: 'genes/by-genus',
    method: 'searchGenes',
    args: [{genus: 'Glycine', pageSize: 20}],
  },
  {
    name: 'genes/by-genus-species',
    method: 'searchGenes',
    args: [{genus: 'Glycine', species: 'max', pageSize: 20}],
  },
  // CONTAINS: LIS identifiers embed the classic name, e.g.
  // glyma.Wm82.gnm4.ann1.Glyma.01G000100 (~4.7k hits in this mine).
  {
    name: 'genes/by-identifier',
    method: 'searchGenes',
    args: [{identifier: 'Glyma.01G', pageSize: 20}],
  },
  // strain flips geneJoinFactory to an INNER join — a distinct SQL shape.
  {
    name: 'genes/by-strain',
    method: 'searchGenes',
    args: [{strain: 'Wm82', pageSize: 20}],
  },
  {
    name: 'genes/by-pangeneset',
    method: 'searchGenes',
    args: [{panGeneSetIdentifier: 'Glycine.pan', pageSize: 20}],
  },
  {
    name: 'genes/by-gene-family',
    method: 'searchGenes',
    args: [{geneFamilyIdentifier: 'legfed_v1_0.L', pageSize: 20}],
    skip: 'GeneFamily is not populated in minimine-genefunction (0 rows), so there is nothing to compare.',
  },

  // Multi-constraint AND: every constraint must land on one query.
  {
    name: 'genes/by-genus-species-strain',
    method: 'searchGenes',
    args: [{genus: 'Glycine', species: 'max', strain: 'Wm82', pageSize: 20}],
  },
  {
    name: 'genes/by-identifier-and-strain',
    method: 'searchGenes',
    args: [{identifier: 'Glyma.01G', strain: 'Wm82', pageSize: 20}],
  },

  // Pagination: offset arithmetic and hasNextPage/numResults must agree.
  {
    name: 'genes/page-2',
    method: 'searchGenes',
    args: [{genus: 'Glycine', page: 2, pageSize: 10}],
  },
  {
    name: 'genes/page-size-1',
    method: 'searchGenes',
    args: [{genus: 'Glycine', page: 1, pageSize: 1}],
  },
  // Deep offset — catches LIMIT/OFFSET drift that page 2 is too shallow to see.
  {
    name: 'genes/deep-page',
    method: 'searchGenes',
    args: [{genus: 'Glycine', page: 500, pageSize: 10}],
  },

  // Negative control: asserts both backends agree on "no match".
  {
    name: 'genes/empty-result',
    method: 'searchGenes',
    args: [{identifier: 'NO_SUCH_GENE_XYZ', pageSize: 20}],
    allowEmpty: true,
  },

  // ---- searchGeneFunctions (exercises LOOKUP + constraint logic) ------------
  // The `gene` arg fans out to seven OR'd constraints (codes L,B,C,D,E,F,K).
  // Each case below is chosen to land on a specific one of those paths.
  //
  // IMPORTANT: constraint L's path (GeneFunction.gene.panGeneSets.genes) implies a
  // join, and searchGeneFunctions declares no outer joins, so InterMine INNER-joins
  // it — even though L is only OR'd in. Every `gene` search is therefore silently
  // restricted to GeneFunctions whose gene is in a pan-gene set, regardless of which
  // OR branch matches (see gf/gene-without-pangeneset below). Values here are picked
  // to have a pan-gene set so each case actually reaches its intended branch.
  {
    name: 'gf/by-gene-identifier',
    method: 'searchGeneFunctions',
    args: [{gene: 'glyma.Wm82.gnm4.ann1.Glyma.06G202300', pageSize: 20}],
    compare: IGNORE_GF,
  },
  {
    name: 'gf/by-gene-symbol',
    method: 'searchGeneFunctions',
    args: [{gene: 'GmABCC8', pageSize: 20}],
    compare: IGNORE_GF,
  },
  {
    name: 'gf/by-classical-locus',
    method: 'searchGeneFunctions',
    args: [{gene: 'D1', pageSize: 20}],
    compare: IGNORE_GF,
  },
  {
    name: 'gf/by-symbol-long',
    method: 'searchGeneFunctions',
    args: [{gene: 'Anthocyanidin Reductase 1', pageSize: 20}],
    compare: IGNORE_GF,
  },
  {
    name: 'gf/by-pub-name',
    method: 'searchGeneFunctions',
    args: [{gene: 'Glyma.04G156400', pageSize: 20}],
    compare: IGNORE_GF,
  },

  // Pins the pan-gene-set inner-join behavior: NAM's symbol matches branch D, but
  // its gene has no pan-gene set, so InterMine returns nothing. Emptiness IS the
  // assertion — a LEFT-joining port would wrongly return the row.
  {
    name: 'gf/gene-without-pangeneset',
    method: 'searchGeneFunctions',
    args: [{gene: 'NAM', pageSize: 20}],
    compare: IGNORE_GF,
    allowEmpty: true,
  },

  // Non-`gene` constraints.
  {
    name: 'gf/by-trait',
    method: 'searchGeneFunctions',
    args: [{trait: 'nodulation', pageSize: 20}],
    compare: IGNORE_GF,
  },
  {
    name: 'gf/by-genus-species',
    method: 'searchGeneFunctions',
    args: [{genus: 'Glycine', species: 'max', pageSize: 20}],
    compare: IGNORE_GF,
  },
  {
    name: 'gf/by-author',
    method: 'searchGeneFunctions',
    args: [{author: 'Smith', pageSize: 20}],
    compare: IGNORE_GF,
  },
  // publicationId branches on '/' -> doi vs pubMedId. Cover both branches.
  {
    name: 'gf/by-pubmed-id',
    method: 'searchGeneFunctions',
    args: [{publicationId: '38378864', pageSize: 20}],
    compare: IGNORE_GF,
  },
  {
    name: 'gf/by-doi',
    method: 'searchGeneFunctions',
    args: [{publicationId: '10.1038/s41588-024-01660-7', pageSize: 20}],
    compare: IGNORE_GF,
  },

  // OR group AND'ed with plain constraints — full `(L OR … OR K) AND G AND H`.
  {
    name: 'gf/by-gene-and-organism',
    method: 'searchGeneFunctions',
    args: [{gene: 'GmABCC8', genus: 'Glycine', species: 'max', pageSize: 20}],
    compare: IGNORE_GF,
  },
  {
    name: 'gf/by-trait-and-organism',
    method: 'searchGeneFunctions',
    args: [
      {trait: 'nodulation', genus: 'Glycine', species: 'max', pageSize: 20},
    ],
    compare: IGNORE_GF,
  },
  {
    name: 'gf/page-2',
    method: 'searchGeneFunctions',
    args: [{genus: 'Glycine', page: 2, pageSize: 5}],
    compare: IGNORE_GF,
  },

  {
    name: 'gf/empty-result',
    method: 'searchGeneFunctions',
    args: [{gene: 'NO_SUCH_ID_XYZ', pageSize: 20}],
    compare: IGNORE_GF,
    allowEmpty: true,
  },

  // ---- get-one (getX(identifier) -> single object or null) ------------------
  // Real identifiers from the mine; each returns exactly one object.
  {name: 'one/organism', method: 'getOrganism', args: [3847], single: true},
  {name: 'one/strain', method: 'getStrain', args: ['Wm82'], single: true},
  {
    name: 'one/data-source',
    method: 'getDataSource',
    args: ['LIS Datastore'],
    single: true,
  },
  {
    name: 'one/publication',
    method: 'getPublication',
    args: ['10.1002/advs.202505181'],
    single: true,
  },
  {
    name: 'one/chromosome',
    method: 'getChromosome',
    args: ['glyma.Amsoy.gnm1.Chr01'],
    single: true,
  },
  {
    name: 'one/author',
    method: 'getAuthor',
    args: ['Lucinda', 'Smith'],
    single: true,
  },
  // Negative control: a non-existent id yields null on both backends.
  {
    name: 'one/organism-missing',
    method: 'getOrganism',
    args: [999999999],
    single: true,
    allowEmpty: true,
  },

  // get-one, real identifiers from the mine (one object each).
  // CDS.transcript is null for every CDS here and getCDS INNER-joins it (not
  // declared OUTER), so InterMine returns null for any CDS — matched via allowEmpty.
  {
    name: 'one/cds',
    method: 'getCDS',
    args: ['glyma.Amsoy.gnm1.ann1.SoyC05_01G000100.m1.cds'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/data-set',
    method: 'getDataSet',
    args: ['G19833.gnm1.zBnF'],
    single: true,
  },
  {
    name: 'one/exon',
    method: 'getExon',
    args: ['glyma.Amsoy.gnm1.ann1.SoyC05_01G000100.m1.exon1'],
    single: true,
  },
  {
    name: 'one/gene',
    method: 'getGene',
    args: ['arahy.Tifrunner.gnm2.ann1.1XW75L'],
    single: true,
  },
  // Polymorphic jsonobjects root: queried with the object attributes (.class /
  // .objectId) and mapped with the object2result fallback replicated. Matches fully.
  {name: 'one/location', method: 'getLocation', args: [12000005], single: true},
  // Transcript.protein is null for every transcript here, and the MRNA/Transcript
  // view INNER-joins protein (not declared OUTER), so InterMine returns null for
  // any MRNA/Transcript — matched via allowEmpty.
  {
    name: 'one/mrna',
    method: 'getMRNA',
    args: ['glyma.Amsoy.gnm1.ann1.SoyC05_01G000100.m1'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/ontology',
    method: 'getOntology',
    args: ['Sequence Ontology'],
    single: true,
  },
  {
    name: 'one/pan-gene-set',
    method: 'getPanGeneSet',
    args: ['Glycine.pan5.pan00001'],
    single: true,
  },
  // residues is a CLOB in InterMine; pg2sqlite left the clob id in the column
  // instead of the (52MB) text, so compare every other field but ignore residues.
  {
    name: 'one/sequence',
    method: 'getSequence',
    args: [6000001],
    single: true,
    compare: {ignoreKeys: ['residues']},
  },
  // Polymorphic jsonobjects root: object attributes + the object2result fallback
  // (absent refs -> the root's own id/identifier) are replicated, so the six
  // fallback fields match InterMine. strainIdentifier is ignored: InterMine's object
  // view reads strain.primaryIdentifier (always null when the strain is present, so
  // it returns null), while our null->root fallback can't tell present-but-null from
  // absent without the FK. Every other field is compared.
  {
    name: 'one/sequence-feature',
    method: 'getSequenceFeature',
    args: [1000014],
    single: true,
    compare: {ignoreKeys: ['strainIdentifier']},
  },
  {
    name: 'one/supercontig',
    method: 'getSupercontig',
    args: ['glyma.Wm82.gnm1.scaffold_1000'],
    single: true,
  },
  {
    name: 'one/transcript',
    method: 'getTranscript',
    args: ['glyma.Amsoy.gnm1.ann1.SoyC05_01G000100.m1'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/utr',
    method: 'getUTR',
    args: ['glyma.Amsoy.gnm1.ann1.SoyC05_01G000300.m1.utr3p1'],
    single: true,
  },

  // get-one on types that are empty or have null keys in this mine. The case still
  // exercises the full method (view attrs, sort, transform) end-to-end and asserts
  // both backends return null; retarget to a real id when the type gains data.
  {
    name: 'one/expression-sample',
    method: 'getExpressionSample',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/expression-source',
    method: 'getExpressionSource',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/expression-value',
    method: 'getExpressionValue',
    args: ['x', 'y'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/gene-family',
    method: 'getGeneFamily',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/gene-family-assignment',
    method: 'getGeneFamilyAssignment',
    args: [1],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/gene-family-tally',
    method: 'getGeneFamilyTally',
    args: [1],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/gene-flanking-region',
    method: 'getGeneFlankingRegion',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/genetic-map',
    method: 'getGeneticMap',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/genetic-marker',
    method: 'getGeneticMarker',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/genotyping-platform',
    method: 'getGenotypingPlatform',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/gwas',
    method: 'getGWAS',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/gwas-result',
    method: 'getGWASResult',
    args: ['x'],
    single: true,
    allowEmpty: true,
    skip: 'InterMine returns HTTP 400 for getGWASResult against minimine (a view/sort path is not in this mine model); cannot compare.',
  },
  {
    name: 'one/intergenic-region',
    method: 'getIntergenicRegion',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/intron',
    method: 'getIntron',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/linkage-group',
    method: 'getLinkageGroup',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/linkage-group-position',
    method: 'getLinkageGroupPosition',
    args: [1],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/newick',
    method: 'getNewick',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/ontology-annotation',
    method: 'getOntologyAnnotation',
    args: [1],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/ontology-relation',
    method: 'getOntologyRelation',
    args: ['x'],
    single: true,
    allowEmpty: true,
    skip: 'InterMine returns HTTP 400 for getOntologyRelation against minimine (a view/sort path is not in this mine model); cannot compare.',
  },
  {
    name: 'one/ontology-term',
    method: 'getOntologyTerm',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/ontology-term-synonym',
    method: 'getOntologyTermSynonym',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/pathway',
    method: 'getPathway',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/phylonode',
    method: 'getPhylonode',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/phylotree',
    method: 'getPhylotree',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/protein',
    method: 'getProtein',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/protein-domain',
    method: 'getProteinDomain',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/protein-match',
    method: 'getProteinMatch',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/qtl',
    method: 'getQTL',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/qtl-study',
    method: 'getQTLStudy',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/sequence-ontology-term',
    method: 'getSequenceOntologyTerm',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/syntenic-region',
    method: 'getSyntenicRegion',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/synteny-block',
    method: 'getSyntenyBlock',
    args: [1],
    single: true,
    allowEmpty: true,
  },
  {
    name: 'one/trait',
    method: 'getTrait',
    args: ['x'],
    single: true,
    allowEmpty: true,
  },

  // ---- get-many (getX(identifiers[]) -> list, no pagination) ----------------
  {
    name: 'many/genes',
    method: 'getGenes',
    args: [
      [
        'glyma.Amsoy.gnm1.ann1.SoyC05_01G000100',
        'glyma.Amsoy.gnm1.ann1.SoyC05_01G000200',
      ],
    ],
  },

  // ---- relationship (getXsForY) ----------------------------------------
  {
    name: 'rel/adjacent-genes-for-intergenic-region',
    method: 'getAdjacentGenesForIntergenicRegion',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/authors-for-publication',
    method: 'getAuthorsForPublication',
    args: [1000002, {pageSize: 10}],
  },
  {
    name: 'rel/cdss-for-transcript',
    method: 'getCDSsForTranscript',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/children-for-phylonode',
    method: 'getChildrenForPhylonode',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/data-sets-for-annotatable',
    method: 'getDataSetsForAnnotatable',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/data-sets-for-data-source',
    method: 'getDataSetsForDataSource',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/data-sets-for-location',
    method: 'getDataSetsForLocation',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/data-sets-for-ontology',
    method: 'getDataSetsForOntology',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/data-sets-for-ontology-annotation',
    method: 'getDataSetsForOntologyAnnotation',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/data-sets-for-ontology-term',
    method: 'getDataSetsForOntologyTerm',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/data-sets-for-organism',
    method: 'getDataSetsForOrganism',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/data-sets-for-strain',
    method: 'getDataSetsForStrain',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/exons-for-transcript',
    method: 'getExonsForTranscript',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/expression-samples-for-expression-source',
    method: 'getExpressionSamplesForExpressionSource',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/gene-family-assignments-for-gene',
    method: 'getGeneFamilyAssignmentsForGene',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/gene-family-assignments-for-protein',
    method: 'getGeneFamilyAssignmentsForProtein',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/gene-family-tallies-for-gene-family',
    method: 'getGeneFamilyTalliesForGeneFamily',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/gene-flanking-regions-for-gene',
    method: 'getGeneFlankingRegionsForGene',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/genes-for-gene-family',
    method: 'getGenesForGeneFamily',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/genes-for-gene-function',
    method: 'getGenesForGeneFunction',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/genes-for-intron',
    method: 'getGenesForIntron',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/genes-for-pan-gene-set',
    method: 'getGenesForPanGeneSet',
    args: [28000003, {pageSize: 10}],
  },
  {
    name: 'rel/genes-for-pathway',
    method: 'getGenesForPathway',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/genes-for-protein',
    method: 'getGenesForProtein',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/genes-for-protein-domain',
    method: 'getGenesForProteinDomain',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/genes-for-qtl',
    method: 'getGenesForQTL',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/genetic-markers-for-genotyping-platform',
    method: 'getGeneticMarkersForGenotypingPlatform',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/genetic-markers-for-gwasresult',
    method: 'getGeneticMarkersForGWASResult',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/genetic-markers-for-qtl',
    method: 'getGeneticMarkersForQTL',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/genotyping-platforms-for-genetic-marker',
    method: 'getGenotypingPlatformsForGeneticMarker',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/introns-for-gene',
    method: 'getIntronsForGene',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/introns-for-transcript',
    method: 'getIntronsForTranscript',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/linkage-group-positions-for-genetic-marker',
    method: 'getLinkageGroupPositionsForGeneticMarker',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/linkage-groups-for-genetic-map',
    method: 'getLinkageGroupsForGeneticMap',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/located-features-for-bio-entity',
    method: 'getLocatedFeaturesForBioEntity',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/locations-for-bio-entity',
    method: 'getLocationsForBioEntity',
    args: ['glyma.Amsoy.gnm1.ann1.SoyC05_01G000100', {pageSize: 10}],
  },
  {
    name: 'rel/ontology-annotations-for-annotatable',
    method: 'getOntologyAnnotationsForAnnotatable',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/ontology-annotations-for-ontology-term',
    method: 'getOntologyAnnotationsForOntologyTerm',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/ontology-relations-for-ontology-term',
    method: 'getOntologyRelationsForOntologyTerm',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/ontology-terms-for-trait',
    method: 'getOntologyTermsForTrait',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/ontology-term-synonyms-for-ontology-term',
    method: 'getOntologyTermSynonymsForOntologyTerm',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/pan-gene-sets-for-gene',
    method: 'getPanGeneSetsForGene',
    args: [1000127, {pageSize: 10}],
  },
  {
    name: 'rel/pan-gene-sets-for-protein',
    method: 'getPanGeneSetsForProtein',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/pan-gene-sets-for-transcript',
    method: 'getPanGeneSetsForTranscript',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/parents-for-ontology-term',
    method: 'getParentsForOntologyTerm',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/pathways-for-gene',
    method: 'getPathwaysForGene',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/phylonodes-for-phylotree',
    method: 'getPhylonodesForPhylotree',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/protein-domains-for-gene',
    method: 'getProteinDomainsForGene',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/protein-domains-for-gene-family',
    method: 'getProteinDomainsForGeneFamily',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/protein-matches-for-protein',
    method: 'getProteinMatchesForProtein',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/proteins-for-gene',
    method: 'getProteinsForGene',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/proteins-for-gene-family',
    method: 'getProteinsForGeneFamily',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/proteins-for-pan-gene-set',
    method: 'getProteinsForPanGeneSet',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/publications-for-annotatable',
    method: 'getPublicationsForAnnotatable',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/publications-for-author',
    method: 'getPublicationsForAuthor',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/publications-for-data-source',
    method: 'getPublicationsForDataSource',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/qtls-for-genetic-marker',
    method: 'getQTLsForGeneticMarker',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/qtls-for-linkage-group',
    method: 'getQTLsForLinkageGroup',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/qtls-for-qtlstudy',
    method: 'getQTLsForQTLStudy',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/qtls-for-trait',
    method: 'getQTLsForTrait',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/strains-for-organism',
    method: 'getStrainsForOrganism',
    args: [1000001, {pageSize: 10}],
  },
  {
    name: 'rel/syntenic-regions-for-synteny-block',
    method: 'getSyntenicRegionsForSyntenyBlock',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/transcripts-for-exon',
    method: 'getTranscriptsForExon',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/transcripts-for-gene',
    method: 'getTranscriptsForGene',
    args: [1000127, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/transcripts-for-intron',
    method: 'getTranscriptsForIntron',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/transcripts-for-pan-gene-set',
    method: 'getTranscriptsForPanGeneSet',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/transcripts-for-utr',
    method: 'getTranscriptsForUTR',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/utrs-for-transcript',
    method: 'getUTRsForTranscript',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/gwasresults-for-gwas',
    method: 'getGWASResultsForGWAS',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/gwasresults-for-genetic-marker',
    method: 'getGWASResultsForGeneticMarker',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/gwasresults-for-trait',
    method: 'getGWASResultsForTrait',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/gwasfor-trait',
    method: 'getGWASForTrait',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/qtlstudy-for-trait',
    method: 'getQTLStudyForTrait',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/traits-for-gene-function',
    method: 'getTraitsForGeneFunction',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },

  // ---- search (faceted) ----------------------------------------------
  {
    name: 'search/organisms',
    method: 'searchOrganisms',
    args: [{genus: 'Glycine', pageSize: 10}],
  },
  {
    name: 'search/traits',
    method: 'searchTraits',
    args: [{name: 'nodulation', pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'search/strains',
    method: 'searchStrains',
    args: [{species: 'max', pageSize: 10}],
  },
  {
    name: 'search/chromosomes',
    method: 'getChromosomes',
    args: [{genus: 'Glycine', pageSize: 10}],
  },
  {
    name: 'search/publications',
    method: 'searchPublications',
    args: [{title: 'a', pageSize: 10}],
  },
  {
    name: 'search/expression-samples',
    method: 'searchExpressionSamples',
    args: [{description: 'ZZ', pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'search/expression-sources',
    method: 'searchExpressionSources',
    args: [{description: 'ZZ', pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'search/expression-values',
    method: 'searchExpressionValues',
    args: [{geneIdentifier: 'ZZ', pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'search/gene-families',
    method: 'searchGeneFamilies',
    args: [{description: 'ZZ', pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'search/genetic-maps',
    method: 'searchGeneticMaps',
    args: [{description: 'ZZ', pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'search/gwases',
    method: 'searchGWASes',
    args: [{description: 'ZZ', pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'search/ontology-terms',
    method: 'searchOntologyTerms',
    args: [{description: 'ZZ', pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'search/proteins',
    method: 'searchProteins',
    args: [{description: 'ZZ', pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'search/protein-domains',
    method: 'searchProteinDomains',
    args: [{description: 'ZZ', pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'search/qtls',
    method: 'searchQTLs',
    args: [{traitName: 'ZZ', pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'search/qtl-studies',
    method: 'searchQTLStudies',
    args: [{description: 'ZZ', pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'search/gene-families-faceted',
    method: 'getGeneFamilies',
    args: [{description: 'ZZ', pageSize: 10}],
    allowEmpty: true,
  },

  // ---- previously-deferred relationship methods ----------------------------
  {
    name: 'rel/child-features-for-protein-domain',
    method: 'getChildFeaturesForProteinDomain',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/parent-features-for-protein-domain',
    method: 'getParentFeaturesForProteinDomain',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/cross-references-for-ontology-term',
    method: 'getCrossReferencesForOntologyTerm',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/parents-for-sequence-ontology-term',
    method: 'getParentsForSequenceOntologyTerm',
    args: [1, {pageSize: 10}],
    allowEmpty: true,
  },
  // SequenceFeature.childFeatures is unpopulated; overlappingFeatures is absent — both empty here.
  {
    name: 'rel/child-features-for-sequence-feature',
    method: 'getChildFeaturesForSequenceFeature',
    args: [1000014, {pageSize: 10}],
    allowEmpty: true,
  },
  {
    name: 'rel/overlapping-features-for-sequence-feature',
    method: 'getOverlappingFeaturesForSequenceFeature',
    args: [1000014, {pageSize: 10}],
    allowEmpty: true,
  },
  // Real data: the gene function's gene synonyms, as a sorted string[] (raw shape).
  {
    name: 'rel/synonyms-for-gene-function',
    method: 'getSynonymsForGeneFunction',
    args: [1000013],
    raw: true,
  },
];
