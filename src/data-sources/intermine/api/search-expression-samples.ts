import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo
} from '../intermine.server.js';
import {
    GraphQLExpressionSample,
    IntermineExpressionSampleResponse,
    intermineExpressionSampleAttributes,
    intermineExpressionSampleSort,
    response2expressionSamples,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchExpressionSamplesOptions = {
    description?: string;
} & PaginationOptions;


// path query search for ExpressionSample by description
export async function searchExpressionSamples(
    {
        description,
        page,
        pageSize,
    }: SearchExpressionSamplesOptions,
): Promise<ApiResponse<GraphQLExpressionSample[]>> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('ExpressionSample.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineExpressionSampleAttributes,
        intermineExpressionSampleSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineExpressionSampleResponse) => response2expressionSamples(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
