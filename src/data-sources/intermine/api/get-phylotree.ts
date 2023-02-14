import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLPhylotree,
  InterminePhylotreeResponse,
  interminePhylotreeAttributes,
  interminePhylotreeSort,
  response2phylotrees,
} from '../models/index.js';


// get a Phylotree by ID
export async function getPhylotree(id: number): Promise<GraphQLPhylotree> {
    const constraints = [intermineConstraint('Phylotree.id', '=', id)];
    const query = interminePathQuery(
        interminePhylotreeAttributes,
        interminePhylotreeSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: InterminePhylotreeResponse) => response2phylotrees(response))
        .then((phylotrees: Array<GraphQLPhylotree>) => {
            if (!phylotrees.length) {
                const msg = `Phylotree with ID '${id}' not found`;
                this.inputError(msg);
            }
            return phylotrees[0];
        });
}
