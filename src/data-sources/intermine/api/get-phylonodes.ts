import {
  ApiResponse,
  IntermineCountResponse,
  intermineConstraint,
  intermineJoin,
  interminePathQuery,
  countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLPhylonode,
  InterminePhylonodeResponse,
  interminePhylonodeAttributes,
  interminePhylonodeSort,
  response2phylonodes,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';

// get Phylonodes using the given query and returns the expected GraphQL types
async function getPhylonodes(
  pathQuery: string,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLPhylonode>> {
  const dataPromise = this.pathQuery(pathQuery, {page, pageSize}).then(
    (response: InterminePhylonodeResponse) => response2phylonodes(response),
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

// get Phylonodes for a Phylotree
export async function getPhylonodesForPhylotree(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLPhylonode>> {
  const constraints = [intermineConstraint('Phylonode.tree.id', '=', id)];
  const joins = [];
  // parent could be null
  joins.push(intermineJoin('Phylonode.parent', 'OUTER'));
  // protein could be null
  joins.push(intermineJoin('Phylonode.protein', 'OUTER'));
  const query = interminePathQuery(
    interminePhylonodeAttributes,
    interminePhylonodeSort,
    constraints,
    joins,
  );
  // get the data
  return getPhylonodes.call(this, query, {page, pageSize});
}

// get Phylonode children of a Phylonode
export async function getChildrenForPhylonode(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLPhylonode>> {
  const constraints = [intermineConstraint('Phylonode.parent.id', '=', id)];
  const joins = [];
  // protein could be null
  joins.push(intermineJoin('Phylonode.protein', 'OUTER'));
  const query = interminePathQuery(
    interminePhylonodeAttributes,
    interminePhylonodeSort,
    constraints,
    joins,
  );
  // get the data
  return getPhylonodes.call(this, query, {page, pageSize});
}
