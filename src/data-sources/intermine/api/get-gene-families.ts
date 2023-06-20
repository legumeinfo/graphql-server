import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneFamily,
    GraphQLProteinDomain,
    IntermineGeneFamilyResponse,
    intermineGeneFamilyAttributes,
    intermineGeneFamilySort,
    response2geneFamilies,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GeneGeneFamiliesOptions = {
    proteinDomain?: GraphQLProteinDomain;
} & PaginationOptions;


// get GeneFamilies for a ProteinDomain
export async function getGeneFamilies(
    {
        proteinDomain,
        start,
        size,
    }: GeneGeneFamiliesOptions,
): Promise<ApiResponse<GraphQLGeneFamily[]>> {
    const constraints = [];
    if (proteinDomain) {
        const proteinDomainConstraint = intermineConstraint('GeneFamily.proteinDomains.id', '=', proteinDomain.id);
        constraints.push(proteinDomainConstraint);
    }
    const query = interminePathQuery(
        intermineGeneFamilyAttributes,
        intermineGeneFamilySort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineGeneFamilyResponse) => response2geneFamilies(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GeneFamily.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
