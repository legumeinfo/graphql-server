import {
  ApiResponse,
  IntermineCountResponse,
  countResponse2graphqlPageInfo,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLProteinMatch,
  IntermineProteinMatchResponse,
  intermineProteinMatchAttributes,
  intermineProteinMatchSort,
  response2proteinMatches,
} from '../models/index.js';
import {bioEntityJoinFactory} from './bio-entity.js';
import {PaginationOptions} from './pagination.js';

// get ProteinMatches associated with a Protein
export async function getProteinMatchesForProtein(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLProteinMatch>> {
  const constraints = [intermineConstraint('ProteinMatch.protein.id', '=', id)];
  const joins = bioEntityJoinFactory('ProteinMatch');
  const query = interminePathQuery(
    intermineProteinMatchAttributes,
    intermineProteinMatchSort,
    constraints,
    joins,
  );
  // get the data
  const dataPromise = this.pathQuery(query, {page, pageSize}).then(
    (response: IntermineProteinMatchResponse) =>
      response2proteinMatches(response),
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
