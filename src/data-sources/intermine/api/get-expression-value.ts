import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLExpressionValue,
  IntermineExpressionValueResponse,
  intermineExpressionValueAttributes,
  intermineExpressionValueSort,
  response2expressionValues,
} from '../models/index.js';


// get an ExpressionValue by sample identifier and gene identifier
export async function getExpressionValue(sampleIdentifier: string, geneIdentifier: string):
Promise<ApiResponse<GraphQLExpressionValue>> {
    const constraints = [
        intermineConstraint('ExpressionValue.sample.primaryIdentifier', '=', sampleIdentifier),
        intermineConstraint('ExpressionValue.feature.primaryIdentifier', '=', geneIdentifier)
    ];
    const query = interminePathQuery(
        intermineExpressionValueAttributes,
        intermineExpressionValueSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineExpressionValueResponse) => response2expressionValues(response))
        .then((expressionValues: Array<GraphQLExpressionValue>) => {
            if (!expressionValues.length) return null;
            return expressionValues[0];
        })
        .then((expressionValue: GraphQLExpressionValue) => ({data: expressionValue}));
}
