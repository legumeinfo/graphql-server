import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGWASResult,
  IntermineGWASResultResponse,
  intermineGWASResultAttributes,
  intermineGWASResultSort,
  response2gwasResults,
} from '../models/index.js';


// get a GWASResult by ID
export async function getGWASResult(id: number): Promise<GraphQLGWASResult> {
    const constraints = [intermineConstraint('GWASResult.id', '=', id)];
    const query = interminePathQuery(
        intermineGWASResultAttributes,
        intermineGWASResultSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGWASResultResponse) => response2gwasResults(response))
        .then((gwasResults: Array<GraphQLGWASResult>) => {
            if (!gwasResults.length) {
                const msg = `GWASResult with ID '${id}' not found`;
                this.inputError(msg);
            }
            return gwasResults[0];
        });
}
