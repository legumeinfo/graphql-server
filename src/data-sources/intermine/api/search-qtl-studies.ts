import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLQTLStudy,
    IntermineQTLStudyResponse,
    intermineQTLStudyAttributes,
    intermineQTLStudySort,
    response2qtlStudies,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchQTLStudiesOptions = {
    description?: string;
} & PaginationOptions;


// path query search for QTLStudies by description
export async function searchQTLStudies(
    {
        description,
        page,
        pageSize,
    }: SearchQTLStudiesOptions,
): Promise<ApiResponse<GraphQLQTLStudy[]>> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('QTLStudy.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineQTLStudyAttributes,
        intermineQTLStudySort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineQTLStudyResponse) => response2qtlStudies(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'QTLStudy.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
