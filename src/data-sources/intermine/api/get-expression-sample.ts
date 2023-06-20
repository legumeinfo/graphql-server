import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLExpressionSample,
  IntermineExpressionSampleResponse,
  intermineExpressionSampleAttributes,
  intermineExpressionSampleSort,
  response2expressionSamples,
} from '../models/index.js';


// get an ExpressionSample by ID
export async function getExpressionSample(identifier: string):
Promise<ApiResponse<GraphQLExpressionSample>> {
    const constraints = [intermineConstraint('ExpressionSample.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineExpressionSampleAttributes,
        intermineExpressionSampleSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineExpressionSampleResponse) => response2expressionSamples(response))
        .then((expressionSamples: Array<GraphQLExpressionSample>) => {
            if (!expressionSamples.length) return null;
            return expressionSamples[0];
        })
        .then((expressionSample: GraphQLExpressionSample) => ({data: expressionSample}));
}
