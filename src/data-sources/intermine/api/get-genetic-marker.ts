import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLGeneticMarker,
    IntermineGeneticMarkerResponse,
    intermineGeneticMarkerAttributes,
    intermineGeneticMarkerSort,
    response2geneticMarkers,
} from '../models/index.js';


// get a GeneticMarker by identifier
export async function getGeneticMarker(identifier: string):
Promise<ApiResponse<GraphQLGeneticMarker>> {
    const constraints = [intermineConstraint('GeneticMarker.primaryIdentifier', '=', identifier)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('GeneticMarker.chromosome', 'OUTER'),
        intermineJoin('GeneticMarker.supercontig', 'OUTER'),
        intermineJoin('GeneticMarker.chromosomeLocation', 'OUTER'),
        intermineJoin('GeneticMarker.supercontigLocation', 'OUTER'),
        intermineJoin('GeneticMarker.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineGeneticMarkerAttributes,
        intermineGeneticMarkerSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneticMarkerResponse) => response2geneticMarkers(response))
        .then((geneticMarkers: Array<GraphQLGeneticMarker>) => {
            if (!geneticMarkers.length) return null;
            return geneticMarkers[0];
        })
        .then((geneticMarker: GraphQLGeneticMarker) => ({data: geneticMarker}));
}
