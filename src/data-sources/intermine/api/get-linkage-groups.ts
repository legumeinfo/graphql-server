import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneticMap,
  GraphQLLinkageGroup,
  IntermineLinkageGroupResponse,
  intermineLinkageGroupAttributes,
  intermineLinkageGroupSort,
  response2linkageGroups,
} from '../models/index.js';


export type GetLinkageGroupsOptions = {
  geneticMap?: GraphQLGeneticMap;
}


// get LinkageGroups for a GeneticMap
export async function getLinkageGroups({geneticMap}: GetLinkageGroupsOptions)
: Promise<GraphQLLinkageGroup[]> {
    const constraints = [];
    if (geneticMap) {
        const geneticMapConstraint = intermineConstraint('LinkageGroup.geneticMap.id', '=', geneticMap.id);
        constraints.push(geneticMapConstraint);
    }
    const query = interminePathQuery(
        intermineLinkageGroupAttributes,
        intermineLinkageGroupSort,
        constraints,
    );
    return this.pathQuery(query)
      .then((response: IntermineLinkageGroupResponse) => response2linkageGroups(response));
}
