import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLProtein,
  IntermineProteinResponse,
  intermineProteinAttributes,
  intermineProteinSort,
  response2proteins,
} from '../models/index.js';


// get a Protein by identifier
export async function getProtein(identifier: string):
Promise<ApiResponse<GraphQLProtein>> {
    const constraints = [intermineConstraint('Protein.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineProteinAttributes,
        intermineProteinSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineProteinResponse) => response2proteins(response))
        .then((proteins: Array<GraphQLProtein>) => {
            if (!proteins.length) return null;
            return proteins[0];
        })
        .then((protein: GraphQLProtein) => ({data: protein}));
}
