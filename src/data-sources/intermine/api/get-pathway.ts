import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLPathway,
  InterminePathwayResponse,
  interminePathwayAttributes,
  interminePathwaySort,
  response2pathways,
} from '../models/index.js';


// get a Pathway by identifier
export async function getPathway(identifier: string): Promise<GraphQLPathway> {
    const constraints = [intermineConstraint('Pathway.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        interminePathwayAttributes,
        interminePathwaySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: InterminePathwayResponse) => response2pathways(response))
        .then((pathways: Array<GraphQLPathway>) => {
            if (!pathways.length) {
                const msg = `Pathway with primaryIdentifier '${identifier}' not found`;
                this.inputError(msg);
            }
            return pathways[0];
        });
}
