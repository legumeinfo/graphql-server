import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLGWASResult,
  IntermineGWASResultResponse,
  intermineGWASResultAttributes,
  intermineGWASResultSort,
  response2gwasResults,
} from '../models/index.js';

// get a GWASResult by primaryIdentifier
export async function getGWASResult(identifier: string):
Promise<ApiResponse<GraphQLGWASResult>> {
    const constraints = [intermineConstraint('GWASResult.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineGWASResultAttributes,
        intermineGWASResultSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGWASResultResponse) => response2gwasResults(response))
        .then((gwasResults: Array<GraphQLGWASResult>) => {
            if (!gwasResults.length) return null;
            return gwasResults[0];
        })
        .then((gwasResult: GraphQLGWASResult) => ({data: gwasResult}));
}
