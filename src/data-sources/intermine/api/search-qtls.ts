import {
  ApiResponse,
  IntermineCountResponse,
  intermineConstraint,
  interminePathQuery,
  countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLQTL,
  IntermineQTLResponse,
  intermineQTLAttributes,
  intermineQTLSort,
  response2qtls,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';

export type SearchQTLsOptions = {
  traitName?: string;
} & PaginationOptions;

// path query search for QTLs by Trait.name
export async function searchQTLs({
  traitName,
  page,
  pageSize,
}: SearchQTLsOptions): Promise<ApiResponse<GraphQLQTL[]>> {
  const constraints = [];
  if (traitName) {
    const constraint = intermineConstraint(
      'QTL.trait.name',
      'CONTAINS',
      traitName,
    );
    constraints.push(constraint);
  }
  const query = interminePathQuery(
    intermineQTLAttributes,
    intermineQTLSort,
    constraints,
  );
  // get the data
  const dataPromise = this.pathQuery(query, {page, pageSize}).then(
    (response: IntermineQTLResponse) => response2qtls(response),
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
