import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo
} from '../intermine.server.js';
import {
    GraphQLExpressionSource,
    IntermineExpressionSourceResponse,
    intermineExpressionSourceAttributes,
    intermineExpressionSourceSort,
    response2expressionSources,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchExpressionSourcesOptions = {
    description?: string;
} & PaginationOptions;


// path query search for ExpressionSource by description
export async function searchExpressionSources(
    {
        description,
        start,
        size,
    }: SearchExpressionSourcesOptions,
): Promise<ApiResponse<GraphQLExpressionSource[]>> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('ExpressionSource.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineExpressionSourceAttributes,
        intermineExpressionSourceSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineExpressionSourceResponse) => response2expressionSources(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'ExpressionSource.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
