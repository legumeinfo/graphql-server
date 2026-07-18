// cases.ts — the compatibility matrix. Add a row to grow coverage; the same row
// runs against both backends. Keep pageSize small so live comparisons stay cheap
// and deterministic. `skip` documents a known, accepted divergence.
//
// Values here are tied to the mine named in TESTING.md (minimine-genefunction).
// A case whose reference returns zero rows proves nothing — both backends agree
// on "nothing" — so the suite fails any case that comes back empty unless it sets
// `allowEmpty` (see compat.test.ts). After pointing at a different mine, run
// `bun run test/compat/triage.ts` to find the rows that went hollow.
import type {CompareOptions} from './canonical.js';

export interface CompatCase {
  name: string;
  method: 'searchGenes' | 'searchGeneFunctions';
  args: Record<string, unknown>;
  compare?: CompareOptions; // per-case overrides
  skip?: string; // reason (still recorded, but assertion skipped)
  // Set only for cases that assert emptiness on purpose. Without it, an empty
  // reference fails the case rather than passing vacuously.
  allowEmpty?: true;
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
    args: {genus: 'Glycine', pageSize: 20},
  },
  {
    name: 'genes/by-genus-species',
    method: 'searchGenes',
    args: {genus: 'Glycine', species: 'max', pageSize: 20},
  },
  // CONTAINS: LIS identifiers embed the classic name, e.g.
  // glyma.Wm82.gnm4.ann1.Glyma.01G000100 (~4.7k hits in this mine).
  {
    name: 'genes/by-identifier',
    method: 'searchGenes',
    args: {identifier: 'Glyma.01G', pageSize: 20},
  },
  // strain flips geneJoinFactory to an INNER join — a distinct SQL shape.
  {
    name: 'genes/by-strain',
    method: 'searchGenes',
    args: {strain: 'Wm82', pageSize: 20},
  },
  {
    name: 'genes/by-pangeneset',
    method: 'searchGenes',
    args: {panGeneSetIdentifier: 'Glycine.pan', pageSize: 20},
  },
  {
    name: 'genes/by-gene-family',
    method: 'searchGenes',
    args: {geneFamilyIdentifier: 'legfed_v1_0.L', pageSize: 20},
    skip: 'GeneFamily is not populated in minimine-genefunction (0 rows), so there is nothing to compare.',
  },

  // Multi-constraint AND: every constraint must land on one query.
  {
    name: 'genes/by-genus-species-strain',
    method: 'searchGenes',
    args: {genus: 'Glycine', species: 'max', strain: 'Wm82', pageSize: 20},
  },
  {
    name: 'genes/by-identifier-and-strain',
    method: 'searchGenes',
    args: {identifier: 'Glyma.01G', strain: 'Wm82', pageSize: 20},
  },

  // Pagination: offset arithmetic and hasNextPage/numResults must agree.
  {
    name: 'genes/page-2',
    method: 'searchGenes',
    args: {genus: 'Glycine', page: 2, pageSize: 10},
  },
  {
    name: 'genes/page-size-1',
    method: 'searchGenes',
    args: {genus: 'Glycine', page: 1, pageSize: 1},
  },
  // Deep offset — catches LIMIT/OFFSET drift that page 2 is too shallow to see.
  {
    name: 'genes/deep-page',
    method: 'searchGenes',
    args: {genus: 'Glycine', page: 500, pageSize: 10},
  },

  // Negative control: asserts both backends agree on "no match".
  {
    name: 'genes/empty-result',
    method: 'searchGenes',
    args: {identifier: 'NO_SUCH_GENE_XYZ', pageSize: 20},
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
  // to have a pan-gene set so each case actually reaches its intended branch; a value
  // without one returns nothing no matter what else matches.
  // B: LOOKUP on the gene's class keys (primaryIdentifier/name).
  {
    name: 'gf/by-gene-identifier',
    method: 'searchGeneFunctions',
    args: {gene: 'glyma.Wm82.gnm4.ann1.Glyma.06G202300', pageSize: 20},
    compare: IGNORE_GF,
  },
  // D: GeneFunction.symbol CONTAINS.
  {
    name: 'gf/by-gene-symbol',
    method: 'searchGeneFunctions',
    args: {gene: 'GmABCC8', pageSize: 20},
    compare: IGNORE_GF,
  },
  // C: GeneFunction.classicalLocus CONTAINS.
  {
    name: 'gf/by-classical-locus',
    method: 'searchGeneFunctions',
    args: {gene: 'D1', pageSize: 20},
    compare: IGNORE_GF,
  },
  // E: GeneFunction.symbolLong CONTAINS.
  {
    name: 'gf/by-symbol-long',
    method: 'searchGeneFunctions',
    args: {gene: 'Anthocyanidin Reductase 1', pageSize: 20},
    compare: IGNORE_GF,
  },
  // K: GeneFunction.pubName CONTAINS.
  {
    name: 'gf/by-pub-name',
    method: 'searchGeneFunctions',
    args: {gene: 'Glyma.04G156400', pageSize: 20},
    compare: IGNORE_GF,
  },

  // Pins the pan-gene-set inner-join behavior described above. GeneFunction 'NAM'
  // exists and its symbol matches branch D exactly, but its gene has no pan-gene
  // set, so InterMine returns nothing. The emptiness IS the assertion: a SQLite
  // port that LEFT-joins the L path would return the row and fail this case, which
  // is the divergence we want caught. If the upstream join bug is ever fixed, this
  // case flips to non-empty and should be retargeted rather than deleted.
  {
    name: 'gf/gene-without-pangeneset',
    method: 'searchGeneFunctions',
    args: {gene: 'NAM', pageSize: 20},
    compare: IGNORE_GF,
    allowEmpty: true,
  },

  // Non-`gene` constraints.
  {
    name: 'gf/by-trait',
    method: 'searchGeneFunctions',
    args: {trait: 'nodulation', pageSize: 20},
    compare: IGNORE_GF,
  },
  {
    name: 'gf/by-genus-species',
    method: 'searchGeneFunctions',
    args: {genus: 'Glycine', species: 'max', pageSize: 20},
    compare: IGNORE_GF,
  },
  {
    name: 'gf/by-author',
    method: 'searchGeneFunctions',
    args: {author: 'Smith', pageSize: 20},
    compare: IGNORE_GF,
  },
  // publicationId branches on '/' -> doi vs pubMedId. Cover both branches.
  {
    name: 'gf/by-pubmed-id',
    method: 'searchGeneFunctions',
    args: {publicationId: '38378864', pageSize: 20},
    compare: IGNORE_GF,
  },
  {
    name: 'gf/by-doi',
    method: 'searchGeneFunctions',
    args: {publicationId: '10.1038/s41588-024-01660-7', pageSize: 20},
    compare: IGNORE_GF,
  },

  // The interesting ones: an OR group AND'ed with plain constraints. Exercises
  // the full logic string `(L OR B OR C OR D OR E OR F OR K) AND G AND H`, where
  // operator precedence is easiest to get wrong.
  {
    name: 'gf/by-gene-and-organism',
    method: 'searchGeneFunctions',
    args: {gene: 'GmABCC8', genus: 'Glycine', species: 'max', pageSize: 20},
    compare: IGNORE_GF,
  },
  {
    name: 'gf/by-trait-and-organism',
    method: 'searchGeneFunctions',
    args: {trait: 'nodulation', genus: 'Glycine', species: 'max', pageSize: 20},
    compare: IGNORE_GF,
  },
  // Pagination over the LOOKUP/OR query shape.
  {
    name: 'gf/page-2',
    method: 'searchGeneFunctions',
    args: {genus: 'Glycine', page: 2, pageSize: 5},
    compare: IGNORE_GF,
  },

  {
    name: 'gf/empty-result',
    method: 'searchGeneFunctions',
    args: {gene: 'NO_SUCH_ID_XYZ', pageSize: 20},
    compare: IGNORE_GF,
    allowEmpty: true,
  },
];
