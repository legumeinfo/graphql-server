import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLLinkageGroup,
  IntermineLinkageGroupResponse,
  intermineLinkageGroupAttributes,
  intermineLinkageGroupSort,
  response2linkageGroups,
} from '../models/index.js';

// get a LinkageGroup by primaryIdentifier
export async function getLinkageGroup(identifier: string):
Promise<ApiResponse<GraphQLLinkageGroup>> {
    const constraints = [intermineConstraint('LinkageGroup.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineLinkageGroupAttributes,
        intermineLinkageGroupSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineLinkageGroupResponse) => response2linkageGroups(response))
        .then((linkageGroups: Array<GraphQLLinkageGroup>) => {
            if (!linkageGroups.length) return null;
            return linkageGroups[0];
        })
        .then((linkageGroup: GraphQLLinkageGroup) => ({data: linkageGroup}));
}
