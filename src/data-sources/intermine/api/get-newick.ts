import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLNewick,
  IntermineNewickResponse,
  intermineNewickAttributes,
  intermineNewickSort,
  response2newicks,
} from '../models/index.js';

// get a Newick by identifier
export async function getNewick(
  identifier: string,
): Promise<ApiResponse<GraphQLNewick>> {
  const constraints = [
    intermineConstraint('Newick.identifier', '=', identifier),
  ];
  const query = interminePathQuery(
    intermineNewickAttributes,
    intermineNewickSort,
    constraints,
  );
  return this.pathQuery(query)
    .then((response: IntermineNewickResponse) => response2newicks(response))
    .then((newicks: Array<GraphQLNewick>) => {
      if (!newicks.length) return null;
      return newicks[0];
    })
    .then((newick: GraphQLNewick) => ({data: newick}));
}
