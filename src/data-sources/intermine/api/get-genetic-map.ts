import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneticMap,
  IntermineGeneticMapResponse,
  intermineGeneticMapAttributes,
  intermineGeneticMapSort,
  response2geneticMaps,
} from '../models/index.js';


// get a GeneticMap by ID
export async function getGeneticMap(id: number): Promise<GraphQLGeneticMap> {
    const constraints = [intermineConstraint('GeneticMap.id', '=', id)];
    const query = interminePathQuery(
        intermineGeneticMapAttributes,
        intermineGeneticMapSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneticMapResponse) => response2geneticMaps(response))
        .then((geneticMaps: Array<GraphQLGeneticMap>) => {
            if (!geneticMaps.length) {
                const msg = `GeneticMap with ID '${id}' not found`;
                this.inputError(msg);
            }
            return geneticMaps[0];
        });
}
