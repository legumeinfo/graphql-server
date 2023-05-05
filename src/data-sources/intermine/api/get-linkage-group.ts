import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLLinkageGroup,
  IntermineLinkageGroupResponse,
  intermineLinkageGroupAttributes,
  intermineLinkageGroupSort,
  response2linkageGroups,
} from '../models/index.js';


// get a LinkageGroup by ID
export async function getLinkageGroup(id: number): Promise<GraphQLLinkageGroup> {
    const constraints = [intermineConstraint('LinkageGroup.id', '=', id)];
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
        });
}
