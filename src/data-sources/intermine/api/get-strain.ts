import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLStrain,
  IntermineStrainResponse,
  intermineStrainAttributes,
  intermineStrainSort,
  response2strains,
} from '../models/index.js';


// get a Strain by ID
export async function getStrain(id: number): Promise<GraphQLStrain> {
    const constraints = [intermineConstraint('Strain.id', '=', id)];
    const query = interminePathQuery(
        intermineStrainAttributes,
        intermineStrainSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineStrainResponse) => response2strains(response))
        .then((strains: Array<GraphQLStrain>) => {
            if (!strains.length) {
                const msg = `Strain with ID '${id}' not found`;
                this.inputError(msg);
            }
            return strains[0];
        });
}
