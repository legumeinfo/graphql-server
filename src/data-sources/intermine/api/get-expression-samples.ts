import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
    GraphQLExpressionSample,
    GraphQLExpressionSource,
    IntermineExpressionSampleResponse,
    intermineExpressionSampleAttributes,
    intermineExpressionSampleSort,
    response2expressionSamples,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetExpressionSamplesOptions = {
    expressionSource?: GraphQLExpressionSource;
} & PaginationOptions;


// get ExpressionSamples for an ExpressionSource
export async function getExpressionSamples(
    {
        expressionSource,
        start,
        size,
    }: GetExpressionSamplesOptions,
): Promise<GraphQLExpressionSample[]> {
    const constraints = [];
    if (expressionSource) {
        const expressionSourceConstraint = intermineConstraint('ExpressionSample.source.id', '=', expressionSource.id);
        constraints.push(expressionSourceConstraint);
    }
    const query = interminePathQuery(
        intermineExpressionSampleAttributes,
        intermineExpressionSampleSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineExpressionSampleResponse) => response2expressionSamples(response));
}
