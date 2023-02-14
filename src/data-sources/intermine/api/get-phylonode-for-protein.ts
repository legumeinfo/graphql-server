import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLPhylonode,
  GraphQLProtein,
  InterminePhylonodeResponse,
  interminePhylonodeAttributes,
  interminePhylonodeSort,
  response2phylonodes,
} from '../models/index.js';


// get a Phylonode for a Protein
export async function getPhylonodeForProtein(protein: GraphQLProtein):
Promise<GraphQLPhylonode|null> {
    const constraints = [intermineConstraint('Phylonode.protein.id', '=', protein.id)];
    const query = interminePathQuery(
        interminePhylonodeAttributes,
        interminePhylonodeSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: InterminePhylonodeResponse) => response2phylonodes(response))
        .then((phylonodes: Array<GraphQLPhylonode>) => {
            if (phylonodes.length) {
                return phylonodes[0];
            } else {
                return null;
            }
        });
}
