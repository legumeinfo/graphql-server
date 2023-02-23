import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLOrganism,
  IntermineOrganismResponse,
  intermineOrganismAttributes,
  intermineOrganismSort,
  response2organisms,
} from '../models/index.js';


// get an Organism by ID
export async function getOrganism(taxonId: number): Promise<GraphQLOrganism> {
    const constraints = [intermineConstraint('Organism.taxonId', '=', taxonId)];
    const query = interminePathQuery(
        intermineOrganismAttributes,
        intermineOrganismSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineOrganismResponse) => response2organisms(response))
        .then((organisms: Array<GraphQLOrganism>) => {
            if (!organisms.length) {
                const msg = `Organism with taxon ID '${taxonId}' not found`;
                this.inputError(msg);
            }
            return organisms[0];
        });
}
