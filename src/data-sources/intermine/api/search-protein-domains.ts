import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLProteinDomain,
    IntermineProteinDomainResponse,
    intermineProteinDomainAttributes,
    intermineProteinDomainSort,
    response2proteinDomains,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchProteinDomainsOptions = {
    description?: string;
} & PaginationOptions;


// path query search for ProteinDomain by description
export async function searchProteinDomains(
    {
        description,
        page,
        pageSize,
    }: SearchProteinDomainsOptions,
): Promise<ApiResponse<GraphQLProteinDomain[]>> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('ProteinDomain.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineProteinDomainAttributes,
        intermineProteinDomainSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineProteinDomainResponse) => response2proteinDomains(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'ProteinDomain.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
