import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLProtein,
  IntermineProteinResponse,
  intermineProteinAttributes,
  intermineProteinSort,
  response2proteins,
} from '../models/index.js';


// get a Protein by ID
export async function getProtein(id: number): Promise<GraphQLProtein> {
    const constraints = [intermineConstraint('Protein.id', '=', id)];
    const query = interminePathQuery(
        intermineProteinAttributes,
        intermineProteinSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineProteinResponse) => response2proteins(response))
        .then((proteins: Array<GraphQLProtein>) => {
            if (!proteins.length) {
                const msg = `Protein with ID '${id}' not found`;
                this.inputError(msg);
            }
            return proteins[0];
        });
}
