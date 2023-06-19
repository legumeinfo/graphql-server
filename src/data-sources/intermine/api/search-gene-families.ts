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


export type SearchGeneFamiliesOptions = {
    description?: string;
} & PaginationOptions;


// path query search for GeneFamily by description
export async function searchGeneFamilies(
    {
        description,
        start,
        size,
    }: SearchGeneFamiliesOptions,
): Promise<ApiResponse<GraphQLGeneFamily[]>> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('GeneFamily.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
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
