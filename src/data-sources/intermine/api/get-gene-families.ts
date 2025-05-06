import {
  ApiResponse,
  IntermineCountResponse,
  intermineConstraint,
  interminePathQuery,
  countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLGeneFamily,
  IntermineGeneFamilyResponse,
  intermineGeneFamilyAttributes,
  intermineGeneFamilySort,
  response2geneFamilies,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';

export type GeneGeneFamiliesOptions = {
  proteinDomain?: string; // ProteinDomain.id
} & PaginationOptions;

// get GeneFamilies for a ProteinDomain
export async function getGeneFamilies({
  proteinDomain,
  page,
  pageSize,
}: GeneGeneFamiliesOptions): Promise<ApiResponse<GraphQLGeneFamily[]>> {
  const constraints = [];
  if (proteinDomain) {
    const proteinDomainConstraint = intermineConstraint(
      'GeneFamily.proteinDomains.id',
      '=',
      proteinDomain,
    );
    constraints.push(proteinDomainConstraint);
  }
  const query = interminePathQuery(
    intermineGeneFamilyAttributes,
    intermineGeneFamilySort,
    constraints,
  );
  // get the data
  const dataPromise = this.pathQuery(query, {page, pageSize}).then(
    (response: IntermineGeneFamilyResponse) => response2geneFamilies(response),
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
