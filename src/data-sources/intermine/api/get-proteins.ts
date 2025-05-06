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
import {PaginationOptions} from './pagination.js';
import {proteinJoinFactory} from './protein.js';

// get Proteins using the given query and returns the expected GraphQL types
async function getProteins(
  pathQuery: string,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLProtein>> {
  // get the data
  const dataPromise = this.pathQuery(pathQuery, {page, pageSize}).then(
    (response: IntermineProteinResponse) => response2proteins(response),
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

// get Proteins associated with a Gene
export async function getProteinsForGene(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLProtein>> {
  const constraints = [intermineConstraint('Protein.genes.id', '=', id)];
  const joins = proteinJoinFactory();
  const query = interminePathQuery(
    intermineProteinAttributes,
    intermineProteinSort,
    constraints,
    joins,
  );
  // get the data
  return getProteins.call(this, query, {page, pageSize});
}

// get Proteins associated with a GeneFamily
export async function getProteinsForGeneFamily(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLProtein>> {
  const constraints = [
    intermineConstraint('Protein.geneFamilyAssignments.geneFamily.id', '=', id),
  ];
  const joins = proteinJoinFactory();
  const query = interminePathQuery(
    intermineProteinAttributes,
    intermineProteinSort,
    constraints,
    joins,
  );
  // get the data
  return getProteins.call(this, query, {page, pageSize});
}

// get Proteins associated with a PanGeneSet
export async function getProteinsForPanGeneSet(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLProtein>> {
  const constraints = [intermineConstraint('Protein.panGeneSets.id', '=', id)];
  const joins = proteinJoinFactory();
  const query = interminePathQuery(
    intermineProteinAttributes,
    intermineProteinSort,
    constraints,
    joins,
  );
  // get the data
  return getProteins.call(this, query, {page, pageSize});
}
