import {
    ApiResponse,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLLocation,
    GraphQLSequenceFeature,
    IntermineLocationResponse,
    intermineLocationAttributes,
    intermineLocationSort,
    response2locations,
} from '../models/index.js';


// get a Supercontig Location for a SequenceFeature
// does NOT throw an error if the supercontig location is not found, since this happens when the feature is on a chromosome
export async function getSupercontigLocation(sequenceFeature: GraphQLSequenceFeature):
Promise<ApiResponse<GraphQLLocation>> {
    const constraints = [intermineConstraint('Location.id', '=', (sequenceFeature.supercontigLocationId === null) ? 0 : sequenceFeature.supercontigLocationId)];
    const query = interminePathQuery(
        intermineLocationAttributes,
        intermineLocationSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineLocationResponse) => response2locations(response))
        .then((locations: Array<GraphQLLocation>) => {
            if (!locations.length) return null;
            return locations[0];
        })
        .then((location: GraphQLLocation) => ({data: location}));
}
