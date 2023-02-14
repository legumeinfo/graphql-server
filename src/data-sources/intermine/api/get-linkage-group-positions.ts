import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneticMarker,
  GraphQLLinkageGroupPosition,
  IntermineLinkageGroupPositionResponse,
  intermineGeneticMarkerLinkageGroupPositionsAttributes,
  intermineGeneticMarkerLinkageGroupPositionsSort,
  response2linkageGroupPositions,
} from '../models/index.js';


// get LinkageGroupPositions for a GeneticMarker
export async function getLinkageGroupPositions(geneticMarker: GraphQLGeneticMarker)
: Promise<GraphQLLinkageGroupPosition[]> {
    // no reverse reference in LinkageGroupPosition so query GeneticMarker
    const constraints = [intermineConstraint('GeneticMarker.id', '=', geneticMarker.id)];
    const query = interminePathQuery(
        intermineGeneticMarkerLinkageGroupPositionsAttributes,
        intermineGeneticMarkerLinkageGroupPositionsSort,
        constraints,
    );
    return this.pathQuery(query)
      .then((response: IntermineLinkageGroupPositionResponse) => response2linkageGroupPositions(response));
}
