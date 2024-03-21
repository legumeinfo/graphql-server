import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo
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
        page,
        pageSize,
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
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineExpressionSourceResponse) => response2expressionSources(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
