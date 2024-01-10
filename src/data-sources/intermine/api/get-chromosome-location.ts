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


// get a Chromosome Location for a SequenceFeature
// does NOT throw an error if the chromosome location is not found, since this happens when the feature is on a supercontig
export async function getChromosomeLocation(sequenceFeature: GraphQLSequenceFeature):
Promise<ApiResponse<GraphQLLocation>> {
    const constraints = [intermineConstraint('Location.id', '=', (sequenceFeature.chromosomeLocationId === null) ? 0 : sequenceFeature.chromosomeLocationId)];
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
