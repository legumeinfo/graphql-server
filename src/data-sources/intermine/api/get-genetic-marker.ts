import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneticMarker,
  IntermineGeneticMarkerResponse,
  intermineGeneticMarkerAttributes,
  intermineGeneticMarkerSort,
  response2geneticMarkers,
} from '../models/index.js';


// get a GeneticMarker by identifier
export async function getGeneticMarker(identifier: string): Promise<GraphQLGeneticMarker> {
    const constraints = [intermineConstraint('GeneticMarker.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineGeneticMarkerAttributes,
        intermineGeneticMarkerSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneticMarkerResponse) => response2geneticMarkers(response))
        .then((geneticMarkers: Array<GraphQLGeneticMarker>) => {
            if (!geneticMarkers.length) return null;
            return geneticMarkers[0];
        });
}
