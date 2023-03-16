import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLLinkageGroup,
  IntermineLinkageGroupResponse,
  intermineLinkageGroupAttributes,
  intermineLinkageGroupSort,
  response2linkageGroups,
} from '../models/index.js';


// get a LinkageGroup by identifier
export async function getLinkageGroup(identifier: string): Promise<GraphQLLinkageGroup> {
    const constraints = [intermineConstraint('LinkageGroup.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineLinkageGroupAttributes,
        intermineLinkageGroupSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineLinkageGroupResponse) => response2linkageGroups(response))
        .then((linkageGroups: Array<GraphQLLinkageGroup>) => {
            if (!linkageGroups.length) {
                const msg = `LinkageGroup with primaryIdentifier '${identifier}' not found`;
                this.inputError(msg);
            }
            return linkageGroups[0];
        });
}
