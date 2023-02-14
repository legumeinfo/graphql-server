import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLExpressionSource,
  IntermineExpressionSourceResponse,
  intermineExpressionSourceAttributes,
  intermineExpressionSourceSort,
  response2expressionSources,
} from '../models/index.js';


// get an ExpressionSource by ID
export async function getExpressionSource(id: number): Promise<GraphQLExpressionSource> {
    const constraints = [intermineConstraint('ExpressionSource.id', '=', id)];
    const query = interminePathQuery(
        intermineExpressionSourceAttributes,
        intermineExpressionSourceSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineExpressionSourceResponse) => response2expressionSources(response))
        .then((expressionSources: Array<GraphQLExpressionSource>) => {
            if (!expressionSources.length) {
                const msg = `ExpressionSource with ID '${id}' not found`;
                this.inputError(msg);
            }
            return expressionSources[0];
        });
}
