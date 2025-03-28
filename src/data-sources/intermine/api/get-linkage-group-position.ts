import {
    ApiResponse,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLLinkageGroupPosition,
    IntermineLinkageGroupPositionResponse,
    intermineLinkageGroupPositionAttributes,
    intermineLinkageGroupPositionSort,
    response2linkageGroupPositions,
} from '../models/index.js';


// get a LinkageGroupPosition by ID
export async function getLinkageGroupPosition(id: number):
Promise<ApiResponse<GraphQLLinkageGroupPosition>> {
    const constraints = [intermineConstraint('LinkageGroupPosition.id', '=', id)];
    const query = interminePathQuery(
        intermineLinkageGroupPositionAttributes,
        intermineLinkageGroupPositionSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineLinkageGroupPositionResponse) => response2linkageGroupPositions(response))
        .then((linkageGroupPositions: Array<GraphQLLinkageGroupPosition>) => {
            if (!linkageGroupPositions.length) return null;
            return linkageGroupPositions[0];
        })
        .then((linkageGroupPosition: GraphQLLinkageGroupPosition) => ({data: linkageGroupPosition}));
}
