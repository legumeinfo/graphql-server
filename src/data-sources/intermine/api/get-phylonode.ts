import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLPhylonode,
  InterminePhylonodeResponse,
  interminePhylonodeAttributes,
  interminePhylonodeSort,
  response2phylonodes,
} from '../models/index.js';


// get a Phylonode by ID
export async function getPhylonode(id: number): Promise<GraphQLPhylonode> {
    const constraints = [intermineConstraint('Phylonode.id', '=', id)];
    const query = interminePathQuery(
        interminePhylonodeAttributes,
        interminePhylonodeSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: InterminePhylonodeResponse) => response2phylonodes(response))
        .then((phylonodes: Array<GraphQLPhylonode>) => {
            if (!phylonodes.length) {
                const msg = `Phylonode with ID '${id}' not found`;
                this.inputError(msg);
            }
            return phylonodes[0];
        });
}
