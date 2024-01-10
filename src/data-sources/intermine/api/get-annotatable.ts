import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLAnnotatable,
  IntermineAnnotatableResponse,
  intermineAnnotatableAttributes,
  intermineAnnotatableSort,
  response2annotatables,
} from '../models/index.js';


// get an Annotatable by id (for internal resolution only)
export async function getAnnotatable(id: number):
Promise<ApiResponse<GraphQLAnnotatable>> {
    const constraints = [intermineConstraint('Annotatable.id', '=', id)];
    const query = interminePathQuery(
        intermineAnnotatableAttributes,
        intermineAnnotatableSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineAnnotatableResponse) => response2annotatables(response))
        .then((annotatables: Array<GraphQLAnnotatable>) => {
            if (!annotatables.length) return null;
            return annotatables[0];
        })
        .then((annotatable: GraphQLAnnotatable) => ({data: annotatable}));
}
