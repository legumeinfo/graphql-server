import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLPanGeneSet,
  InterminePanGeneSetResponse,
  interminePanGeneSetAttributes,
  interminePanGeneSetSort,
  response2panGeneSets,
} from '../models/index.js';


// get a PanGeneSet by primaryIdentifier
export async function getPanGeneSet(identifier: string):
Promise<ApiResponse<GraphQLPanGeneSet>> {
    const constraints = [intermineConstraint('PanGeneSet.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        interminePanGeneSetAttributes,
        interminePanGeneSetSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: InterminePanGeneSetResponse) => response2panGeneSets(response))
        .then((panGeneSets: Array<GraphQLPanGeneSet>) => {
            if (!panGeneSets.length) return null;
            return panGeneSets[0];
        })
        .then((panGeneSet: GraphQLPanGeneSet) => ({data: panGeneSet}));
}
