import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLStrain,
  IntermineStrainResponse,
  intermineStrainAttributes,
  intermineStrainSort,
  response2strains,
} from '../models/index.js';


// get a Strain by identifier
export async function getStrain(identifier: string): Promise<GraphQLStrain> {
    const constraints = [intermineConstraint('Strain.identifier', '=', identifier)];
    const query = interminePathQuery(
        intermineStrainAttributes,
        intermineStrainSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineStrainResponse) => response2strains(response))
        .then((strains: Array<GraphQLStrain>) => {
            if (!strains.length) return null;
            return strains[0];
        });
}
