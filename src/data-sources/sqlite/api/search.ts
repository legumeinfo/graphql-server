// search.ts — the faceted searchX methods (plus getChromosomes / getGeneFamilies,
// which are search-shaped). Each builds optional constraints from an options object
// and AND-combines them, like search-genes.ts. Mirrors the InterMine api verbatim
// except for query construction.
import {SqliteServer, ApiResponse, PageOpts} from '../sqlite.server.js';
import type {Constraint, SqlOp} from '../path-resolver.js';
import {pageQuery, outerPaths} from './helpers.js';
import * as M from '../../intermine/models/index.js';
import {geneFamilyJoinFactory} from '../../intermine/api/gene-family.js';
import {bioEntityJoinFactory} from '../../intermine/api/bio-entity.js';
import {traitJoinFactory} from '../../intermine/api/trait.js';
import {sequenceFeatureJoinFactory} from '../../intermine/api/sequence-feature.js';

type Spec = {key: string; path: string; op: SqlOp};

// Build a search method: for each spec whose option is set, add a constraint; AND
// them all (no logic string). `root` is the constraint paths' class.
function search(
  root: string,
  attrs: string[],
  sort: string,
  transform: (r: any) => any[],
  specs: Spec[],
  outerJoins: string[] = [],
) {
  return function (
    this: SqliteServer,
    o: Record<string, unknown> & PageOpts = {},
  ): Promise<ApiResponse<any[]>> {
    const constraints: Constraint[] = [];
    for (const {key, path, op} of specs) {
      const v = o[key];
      if (v != null && v !== '')
        constraints.push({path, op, value: v as string | number});
    }
    return Promise.resolve(
      pageQuery(
        this,
        root,
        attrs,
        sort,
        transform,
        constraints,
        undefined,
        {page: o.page, pageSize: o.pageSize},
        outerJoins,
      ),
    );
  };
}

const C = (key: string, path: string, op: SqlOp = 'CONTAINS'): Spec => ({
  key,
  path,
  op,
});

export const searchExpressionSamples = search(
  'ExpressionSample',
  M.intermineExpressionSampleAttributes,
  M.intermineExpressionSampleSort,
  M.response2expressionSamples,
  [C('description', 'ExpressionSample.description')],
);
export const searchExpressionSources = search(
  'ExpressionSource',
  M.intermineExpressionSourceAttributes,
  M.intermineExpressionSourceSort,
  M.response2expressionSources,
  [C('description', 'ExpressionSource.description')],
);
export const searchExpressionValues = search(
  'ExpressionValue',
  M.intermineExpressionValueAttributes,
  M.intermineExpressionValueSort,
  M.response2expressionValues,
  [
    C('geneIdentifier', 'ExpressionValue.feature.primaryIdentifier', '='),
    C('sampleIdentifier', 'ExpressionValue.sample.primaryIdentifier', '='),
  ],
);
export const searchGeneFamilies = search(
  'GeneFamily',
  M.intermineGeneFamilyAttributes,
  M.intermineGeneFamilySort,
  M.response2geneFamilies,
  [C('description', 'GeneFamily.description')],
  outerPaths(geneFamilyJoinFactory()),
);
export const searchGeneticMaps = search(
  'GeneticMap',
  M.intermineGeneticMapAttributes,
  M.intermineGeneticMapSort,
  M.response2geneticMaps,
  [C('description', 'GeneticMap.description')],
);
export const searchGWASes = search(
  'GWAS',
  M.intermineGWASAttributes,
  M.intermineGWASSort,
  M.response2gwas,
  [C('description', 'GWAS.description')],
);
export const searchOntologyTerms = search(
  'OntologyTerm',
  M.intermineOntologyTermAttributes,
  M.intermineOntologyTermSort,
  M.response2ontologyTerms,
  [C('description', 'OntologyTerm.description')],
);
export const searchOrganisms = search(
  'Organism',
  M.intermineOrganismAttributes,
  M.intermineOrganismSort,
  M.response2organisms,
  [
    C('taxonId', 'Organism.taxonId', '='),
    C('abbreviation', 'Organism.abbreviation', '='),
    C('name', 'Organism.name', '='),
    C('genus', 'Organism.genus', '='),
    C('species', 'Organism.species', '='),
  ],
);
export const searchProteins = search(
  'Protein',
  M.intermineProteinAttributes,
  M.intermineProteinSort,
  M.response2proteins,
  [C('description', 'Protein.description')],
  outerPaths(bioEntityJoinFactory('Protein')),
);
export const searchProteinDomains = search(
  'ProteinDomain',
  M.intermineProteinDomainAttributes,
  M.intermineProteinDomainSort,
  M.response2proteinDomains,
  [C('description', 'ProteinDomain.description')],
);
export const searchPublications = search(
  'Publication',
  M.interminePublicationAttributes,
  M.interminePublicationSort,
  M.response2publications,
  [C('title', 'Publication.title')],
);
export const searchQTLs = search(
  'QTL',
  M.intermineQTLAttributes,
  M.intermineQTLSort,
  M.response2qtls,
  [C('traitName', 'QTL.trait.name')],
);
export const searchQTLStudies = search(
  'QTLStudy',
  M.intermineQTLStudyAttributes,
  M.intermineQTLStudySort,
  M.response2qtlStudies,
  [C('description', 'QTLStudy.description')],
);
export const searchStrains = search(
  'Strain',
  M.intermineStrainAttributes,
  M.intermineStrainSort,
  M.response2strains,
  [
    C('description', 'Strain.description'),
    C('origin', 'Strain.origin'),
    C('species', 'Strain.organism.species', '='),
  ],
);

// getChromosomes / getGeneFamilies are faceted (organism-scoped) — same shape.
export const getChromosomes = search(
  'Chromosome',
  M.intermineChromosomeAttributes,
  M.intermineChromosomeSort,
  M.response2chromosomes,
  [
    C('genus', 'Chromosome.organism.genus', '='),
    C('species', 'Chromosome.organism.species', '='),
  ],
  outerPaths(sequenceFeatureJoinFactory('Chromosome')),
);
export const getGeneFamilies = search(
  'GeneFamily',
  M.intermineGeneFamilyAttributes,
  M.intermineGeneFamilySort,
  M.response2geneFamilies,
  [C('description', 'GeneFamily.description')],
  outerPaths(geneFamilyJoinFactory()),
);

// searchTraits: publicationId branches on '/' (doi vs pubMedId), plus a join factory.
export async function searchTraits(
  this: SqliteServer,
  o: {
    name?: string;
    genus?: string;
    species?: string;
    publicationId?: string;
    author?: string;
  } & PageOpts = {},
): Promise<ApiResponse<any[]>> {
  const c: Constraint[] = [];
  const filters: string[] = [];
  const add = (code: string, path: string, op: SqlOp, value: string) => {
    c.push({path, op, value, code});
    filters.push(code);
  };
  if (o.name) add('C', 'Trait.name', 'CONTAINS', o.name);
  if (o.genus) add('D', 'Trait.organism.genus', '=', o.genus);
  if (o.species) add('E', 'Trait.organism.species', '=', o.species);
  if (o.publicationId)
    add(
      'F',
      o.publicationId.includes('/')
        ? 'Trait.publications.doi'
        : 'Trait.publications.pubMedId',
      '=',
      o.publicationId,
    );
  if (o.author)
    add('G', 'Trait.publications.authors.name', 'CONTAINS', o.author);
  // With no studyType, InterMine requires each trait to have a study association:
  // Trait.gwas OR Trait.qtlStudy present. Restricts a trait search to associated
  // traits (both are empty in this mine, so every search returns nothing — matched).
  c.push({path: 'Trait.gwas', op: 'IS NOT NULL', code: 'A'});
  c.push({path: 'Trait.qtlStudy', op: 'IS NOT NULL', code: 'B'});
  const logic = filters.length
    ? `${filters.join(' AND ')} AND (A OR B)`
    : '(A OR B)';
  return pageQuery(
    this,
    'Trait',
    (M as any).intermineTraitBaseAttributes,
    M.intermineTraitSort,
    (M as any).response2traitsBase,
    c,
    logic,
    {page: o.page, pageSize: o.pageSize},
    outerPaths(traitJoinFactory()),
  );
}
