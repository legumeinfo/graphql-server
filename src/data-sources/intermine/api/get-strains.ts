import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLOrganism,
  GraphQLStrain,
  IntermineStrainResponse,
  intermineStrainAttributes,
  intermineStrainSort,
  response2strains,
} from '../models/index.js';


export type GetStrainsOptions = {
  organism?: GraphQLOrganism;
};


// get Strains associated with an Organism
export async function getStrains({organism}: GetStrainsOptions): Promise<GraphQLStrain[]> {
    const constraints = [];
    if (organism) {
        const organismConstraint = intermineConstraint('Strain.organism.id', '=', organism.id);
        constraints.push(organismConstraint);
    }
    const query = interminePathQuery(
        intermineStrainAttributes,
        intermineStrainSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineStrainResponse) => response2strains(response));
}
