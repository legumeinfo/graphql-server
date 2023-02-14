import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLExpressionSample,
  IntermineExpressionSampleResponse,
  intermineExpressionSampleAttributes,
  intermineExpressionSampleSort,
  response2expressionSamples,
} from '../models/index.js';


// get an ExpressionSample by ID
export async function getExpressionSample(id: number): Promise<GraphQLExpressionSample> {
    const constraints = [intermineConstraint('ExpressionSample.id', '=', id)];
    const query = interminePathQuery(
        intermineExpressionSampleAttributes,
        intermineExpressionSampleSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineExpressionSampleResponse) => response2expressionSamples(response))
        .then((expressionSamples: Array<GraphQLExpressionSample>) => {
            if (!expressionSamples.length) {
                const msg = `ExpressionSample with ID '${id}' not found`;
                this.inputError(msg);
            }
            return expressionSamples[0];
        });
}
