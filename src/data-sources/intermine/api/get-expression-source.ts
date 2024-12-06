import {
    ApiResponse,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLExpressionSource,
    IntermineExpressionSourceResponse,
    intermineExpressionSourceAttributes,
    intermineExpressionSourceSort,
    response2expressionSources,
} from '../models/index.js';


// get an ExpressionSource by ID
export async function getExpressionSource(identifier: string):
Promise<ApiResponse<GraphQLExpressionSource>> {
    const constraints = [intermineConstraint('ExpressionSource.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineExpressionSourceAttributes,
        intermineExpressionSourceSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineExpressionSourceResponse) => response2expressionSources(response))
        .then((expressionSources: Array<GraphQLExpressionSource>) => {
            if (!expressionSources.length) return null;
            return expressionSources[0];
        })
        .then((expressionSource: GraphQLExpressionSource) => ({data: expressionSource}));
}
