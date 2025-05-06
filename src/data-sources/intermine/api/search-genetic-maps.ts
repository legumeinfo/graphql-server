import {
  ApiResponse,
  IntermineCountResponse,
  intermineConstraint,
  interminePathQuery,
  countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLGeneticMap,
  IntermineGeneticMapResponse,
  intermineGeneticMapAttributes,
  intermineGeneticMapSort,
  response2geneticMaps,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';

export type SearchGeneticMapsOptions = {
  description?: string;
} & PaginationOptions;

// path query search for GeneticMap by description
export async function searchGeneticMaps({
  description,
  page,
  pageSize,
}: SearchGeneticMapsOptions): Promise<ApiResponse<GraphQLGeneticMap[]>> {
  const constraints = [];
  if (description) {
    const descriptionConstraint = intermineConstraint(
      'GeneticMap.description',
      'CONTAINS',
      description,
    );
    constraints.push(descriptionConstraint);
  }
  const query = interminePathQuery(
    intermineGeneticMapAttributes,
    intermineGeneticMapSort,
    constraints,
  );
  // get the data
  const dataPromise = this.pathQuery(query, {page, pageSize}).then(
    (response: IntermineGeneticMapResponse) => response2geneticMaps(response),
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
