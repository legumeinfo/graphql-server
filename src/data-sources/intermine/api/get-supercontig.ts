import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLSupercontig,
  IntermineSupercontigResponse,
  intermineSupercontigAttributes,
  intermineSupercontigSort,
  response2supercontigs,
} from '../models/index.js';


// get a Supercontig by identifier
export async function getSupercontig(identifier: string): Promise<GraphQLSupercontig> {
    const constraints = [intermineConstraint('Supercontig.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineSupercontigAttributes,
        intermineSupercontigSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineSupercontigResponse) => response2supercontigs(response))
        .then((supercontigs: Array<GraphQLSupercontig>) => {
            if (!supercontigs.length) {
                const msg = `Supercontig with primaryIdentifier '${identifier}' not found`;
                this.inputError(msg);
            }
            return supercontigs[0];
        });
}
