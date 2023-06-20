import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLPhylotree,
  InterminePhylotreeResponse,
  interminePhylotreeAttributes,
  interminePhylotreeSort,
  response2phylotrees,
} from '../models/index.js';


// get a Phylotree by identifier
export async function getPhylotree(identifier: string):
Promise<ApiResponse<GraphQLPhylotree>> {
    const constraints = [intermineConstraint('Phylotree.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        interminePhylotreeAttributes,
        interminePhylotreeSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: InterminePhylotreeResponse) => response2phylotrees(response))
        .then((phylotrees: Array<GraphQLPhylotree>) => {
            if (!phylotrees.length) return null;
            return phylotrees[0];
        })
        .then((phylotree: GraphQLPhylotree) => ({data: phylotree}));
}
