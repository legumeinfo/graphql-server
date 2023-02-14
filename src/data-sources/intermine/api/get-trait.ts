import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLTrait,
  IntermineTraitResponse,
  intermineTraitAttributes,
  intermineTraitSort,
  response2traits,
} from '../models/index.js';


// get a Trait by ID
export async function getTrait(id: number): Promise<GraphQLTrait> {
    const constraints = [intermineConstraint('Trait.id', '=', id)];
    const query = interminePathQuery(
        intermineTraitAttributes,
        intermineTraitSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineTraitResponse) => response2traits(response))
        .then((traits: Array<GraphQLTrait>) => {
            if (!traits.length) {
                const msg = `Trait with ID '${id}' not found`;
                this.inputError(msg);
            }
            return traits[0];
        });
}
