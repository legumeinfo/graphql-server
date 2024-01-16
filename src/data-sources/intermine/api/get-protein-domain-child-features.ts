import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
  intermineProteinDomainChildFeatureAttributes,
  intermineProteinDomainChildFeatureSort,
  GraphQLProteinDomain,
  IntermineProteinDomainResponse,
  response2proteinDomains,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetProteinDomainChildFeaturesOptions = {
  proteinDomain?: GraphQLProteinDomain;
} & PaginationOptions;

// get (ProteinDomain) childFeatures for a ProteinDomain
export async function getProteinDomainChildFeatures(
    {proteinDomain, page, pageSize}: GetProteinDomainChildFeaturesOptions,
): Promise<ApiResponse<GraphQLProteinDomain>> {
    const constraints = [
        intermineConstraint('ProteinDomain.id', '=', proteinDomain.id)
    ];
    const query = interminePathQuery(
        intermineProteinDomainChildFeatureAttributes,
        intermineProteinDomainChildFeatureSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
      .then((response: IntermineProteinDomainResponse) => response2proteinDomains(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'ProteinDomain.childFeatures.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
