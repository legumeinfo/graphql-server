import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
  intermineProteinDomainParentFeatureAttributes,
  intermineProteinDomainParentFeatureSort,
  GraphQLProteinDomain,
  IntermineProteinDomainResponse,
  response2proteinDomains,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetProteinDomainParentFeaturesOptions = {
  proteinDomain?: GraphQLProteinDomain;
} & PaginationOptions;

// get (ProteinDomain) parentFeatures for a ProteinDomain
export async function getProteinDomainParentFeatures(
    {proteinDomain, page, pageSize}: GetProteinDomainParentFeaturesOptions,
): Promise<ApiResponse<GraphQLProteinDomain>> {
    const constraints = [
        intermineConstraint('ProteinDomain.id', '=', proteinDomain.id)
    ];
    const query = interminePathQuery(
        intermineProteinDomainParentFeatureAttributes,
        intermineProteinDomainParentFeatureSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
      .then((response: IntermineProteinDomainResponse) => response2proteinDomains(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'ProteinDomain.parentFeatures.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
