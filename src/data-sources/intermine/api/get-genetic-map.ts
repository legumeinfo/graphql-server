import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneticMap,
  IntermineGeneticMapResponse,
  intermineGeneticMapAttributes,
  intermineGeneticMapSort,
  response2geneticMaps,
} from '../models/index.js';


// get a GeneticMap by identifier
export async function getGeneticMap(identifier: string): Promise<GraphQLGeneticMap> {
    const constraints = [intermineConstraint('GeneticMap.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineGeneticMapAttributes,
        intermineGeneticMapSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneticMapResponse) => response2geneticMaps(response))
        .then((geneticMaps: Array<GraphQLGeneticMap>) => {
            if (!geneticMaps.length) return null;
            return geneticMaps[0];
        });
}
