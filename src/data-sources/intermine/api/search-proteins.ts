import {
  ApiResponse,
  IntermineCountResponse,
  intermineConstraint,
  interminePathQuery,
  countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLProtein,
  IntermineProteinResponse,
  intermineProteinAttributes,
  intermineProteinSort,
  response2proteins,
} from '../models/index.js';
import {bioEntityJoinFactory} from './bio-entity.js';
import {PaginationOptions} from './pagination.js';

export type SearchProteinsOptions = {
  description?: string;
} & PaginationOptions;

// path query search for Protein by description
export async function searchProteins({
  description,
  page,
  pageSize,
}: SearchProteinsOptions): Promise<ApiResponse<GraphQLProtein[]>> {
  const constraints = [];
  if (description) {
    const descriptionConstraint = intermineConstraint(
      'Protein.description',
      'CONTAINS',
      description,
    );
    constraints.push(descriptionConstraint);
  }
  const joins = bioEntityJoinFactory('Protein');
  const query = interminePathQuery(
    intermineProteinAttributes,
    intermineProteinSort,
    constraints,
    joins,
  );
  // get the data
  const dataPromise = this.pathQuery(query, {page, pageSize}).then(
    (response: IntermineProteinResponse) => response2proteins(response),
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
