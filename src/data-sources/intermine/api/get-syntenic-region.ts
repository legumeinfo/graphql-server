import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLSyntenicRegion,
  IntermineSyntenicRegionResponse,
  intermineSyntenicRegionAttributes,
  intermineSyntenicRegionSort,
  response2syntenicRegions,
} from '../models/index.js';


// get a SyntenicRegion by identifier
export async function getSyntenicRegion(identifier: string): Promise<GraphQLSyntenicRegion> {
    const constraints = [intermineConstraint('SyntenicRegion.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineSyntenicRegionAttributes,
        intermineSyntenicRegionSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineSyntenicRegionResponse) => response2syntenicRegions(response))
        .then((syntenicRegions: Array<GraphQLSyntenicRegion>) => {
            if (!syntenicRegions.length) return null;
            return syntenicRegions[0];
        });
}
