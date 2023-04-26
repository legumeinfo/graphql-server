import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLPhylotree,
  InterminePhylotreeResponse,
  interminePhylotreeAttributes,
  interminePhylotreeSort,
  response2phylotrees,
} from '../models/index.js';


// get a Phylotree by identifier
export async function getPhylotree(identifier: string): Promise<GraphQLPhylotree> {
    const constraints = [intermineConstraint('Phylotree.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        interminePhylotreeAttributes,
        interminePhylotreeSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: InterminePhylotreeResponse) => response2phylotrees(response))
        .then((phylotrees: Array<GraphQLPhylotree>) => {
            // some gene families do not have a corresponding phylotree - don't throw error
            if (phylotrees.length) {
                return phylotrees[0];
            } else {
                return null;
            }
        });
}
