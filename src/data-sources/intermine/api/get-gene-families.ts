import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneFamily,
    IntermineGeneFamilyResponse,
    intermineGeneFamilyAttributes,
    intermineGeneFamilySort,
    response2geneFamilies,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get GeneFamilies for a ProteinDomain
export async function getGeneFamiliesForProteinDomain(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLProteinDomain>> {
    const constraints = [intermineConstraint('GeneFamily.proteinDomains.id', '=', id)];
    const query = interminePathQuery(
        intermineGeneFamilyAttributes,
        intermineGeneFamilySort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneFamilyResponse) => response2geneFamilies(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GeneFamily.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
