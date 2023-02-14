import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLPathway,
  InterminePathwayResponse,
  interminePathwayAttributes,
  interminePathwaySort,
  response2pathways,
} from '../models/index.js';


// get a Pathway by ID
export async function getPathway(id: number): Promise<GraphQLPathway> {
    const constraints = [intermineConstraint('Pathway.id', '=', id)];
    const query = interminePathQuery(
        interminePathwayAttributes,
        interminePathwaySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: InterminePathwayResponse) => response2pathways(response))
        .then((pathways: Array<GraphQLPathway>) => {
            if (!pathways.length) {
                const msg = `Pathway with ID '${id}' not found`;
                this.inputError(msg);
            }
            return pathways[0];
        });
}
