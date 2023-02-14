import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneticMarker,
  IntermineGeneticMarkerResponse,
  intermineGeneticMarkerAttributes,
  intermineGeneticMarkerSort,
  response2geneticMarkers,
} from '../models/index.js';


// get a GeneticMarker by ID
export async function getGeneticMarker(id: number): Promise<GraphQLGeneticMarker> {
    const constraints = [intermineConstraint('GeneticMarker.id', '=', id)];
    const query = interminePathQuery(
        intermineGeneticMarkerAttributes,
        intermineGeneticMarkerSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneticMarkerResponse) => response2geneticMarkers(response))
        .then((geneticMarkers: Array<GraphQLGeneticMarker>) => {
            if (!geneticMarkers.length) {
                const msg = `GeneticMarker with ID '${id}' not found`;
                this.inputError(msg);
            }
            return geneticMarkers[0];
        });
}
