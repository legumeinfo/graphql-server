import {
  ApiResponse,
  IntermineCountResponse,
  countResponse2graphqlPageInfo,
  intermineConstraint,
  intermineJoin,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLTrait,
  IntermineTraitBaseResponse,
  intermineTraitBaseAttributes,
  intermineTraitSort,
  response2traitsBase,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';

// get Traits using base attributes (no relationship-dependent fields)
async function getTraitsBase(
  pathQuery: string,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLTrait>> {
  // get the data
  const dataPromise = this.pathQuery(pathQuery, {page, pageSize}).then(
    (response: IntermineTraitBaseResponse) => response2traitsBase(response),
  );
  // get a summary of the data and convert it to page info
  const pageInfoPromise = this.pathQueryCount(pathQuery).then(
    (response: IntermineCountResponse) =>
      countResponse2graphqlPageInfo(response, page, pageSize),
  );
  // return the expected GraphQL type
  return Promise.all([dataPromise, pageInfoPromise]).then(
    ([data, pageInfo]) => ({data, metadata: {pageInfo}}),
  );
}

// get Traits associated with a GeneFunction
// Uses base attributes since gene function traits often lack dataSets/organism/gwas relationships
export async function getTraitsForGeneFunction(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLTrait>> {
  const constraints = [intermineConstraint('Trait.geneFunctions.id', '=', id)];
  const joins = [intermineJoin('Trait.geneFunctions', 'INNER')];
  const query = interminePathQuery(
    intermineTraitBaseAttributes,
    intermineTraitSort,
    constraints,
    joins,
  );
  return getTraitsBase.call(this, query, {page, pageSize});
}
