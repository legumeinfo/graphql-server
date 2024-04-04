import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLGeneticMarker,
  IntermineGeneticMarkerResponse,
  intermineGeneticMarkerAttributes,
  intermineGeneticMarkerSort,
  response2geneticMarkers,
} from '../models/index.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';


// get a GeneticMarker by identifier
export async function getGeneticMarker(identifier: string):
Promise<ApiResponse<GraphQLGeneticMarker>> {
    const constraints = [intermineConstraint('GeneticMarker.primaryIdentifier', '=', identifier)];
    const joins = sequenceFeatureJoinFactory('GeneticMarker');
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
