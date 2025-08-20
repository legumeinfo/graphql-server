import {
  ApiResponse,
  IntermineCountResponse,
  intermineConstraint,
  interminePathQuery,
  countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLGene,
  IntermineGeneResponse,
  intermineGeneAttributes,
  intermineGeneSort,
  response2genes,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';
import {sequenceFeatureJoinFactory} from './sequence-feature.js';

export type SearchGenesOptions = {
  description?: string;
  genus?: string;
  species?: string;
  strain?: string;
  identifier?: string;
  name?: string;
  geneFamilyIdentifier?: string;
  panGeneSetIdentifier?: string;
} & PaginationOptions;

// path query search for Gene by description, etc.
export async function searchGenes({
  description,
  genus,
  species,
  strain,
  identifier,
  name,
  geneFamilyIdentifier,
  panGeneSetIdentifier,
  page,
  pageSize,
}: SearchGenesOptions): Promise<ApiResponse<GraphQLGene[]>> {
  // build the PathQuery
  const constraints = [];
  if (description) {
    constraints.push(
      intermineConstraint('Gene.description', 'CONTAINS', description),
    );
  }
  if (genus) {
    constraints.push(intermineConstraint('Gene.organism.genus', '=', genus));
  }
  if (species) {
    constraints.push(
      intermineConstraint('Gene.organism.species', '=', species),
    );
  }
  if (strain) {
    constraints.push(
      intermineConstraint('Gene.strain.identifier', '=', strain),
    );
  }
  if (identifier) {
    constraints.push(
      intermineConstraint('Gene.primaryIdentifier', 'CONTAINS', identifier),
    );
  }
  if (name) {
    constraints.push(intermineConstraint('Gene.name', 'CONTAINS', name));
  }
  if (geneFamilyIdentifier) {
    constraints.push(
      intermineConstraint(
        'Gene.geneFamilyAssignments.geneFamily.primaryIdentifier',
        'CONTAINS',
        geneFamilyIdentifier,
      ),
    );
  }
  if (panGeneSetIdentifier) {
    constraints.push(
      intermineConstraint(
        'Gene.panGeneSets.primaryIdentifier',
        'CONTAINS',
        panGeneSetIdentifier,
      ),
    );
  }
  const joins = sequenceFeatureJoinFactory('Gene');
  const query = interminePathQuery(
    intermineGeneAttributes,
    intermineGeneSort,
    constraints,
    joins,
  );
  // get the data
  const dataPromise = this.pathQuery(query, {page, pageSize}).then(
    (response: IntermineGeneResponse) => response2genes(response),
  );
  // get a summary of the data and convert it to page info
  const pageInfoPromise = this.pathQueryCount(query).then(
    (response: IntermineCountResponse) =>
      countResponse2graphqlPageInfo(response, page, pageSize),
  );
  // return the expected GraphQL type
  return Promise.all([dataPromise, pageInfoPromise]).then(
    ([data, pageInfo]) => ({data, metadata: {pageInfo}}),
  );
}
