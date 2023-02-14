import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLSyntenicRegion,
  IntermineSyntenicRegionResponse,
  intermineSyntenicRegionAttributes,
  intermineSyntenicRegionSort,
  response2syntenicRegions,
} from '../models/index.js';


// get a SyntenicRegion by ID
export async function getSyntenicRegion(id: number): Promise<GraphQLSyntenicRegion> {
    const constraints = [intermineConstraint('SyntenicRegion.id', '=', id)];
    const query = interminePathQuery(
        intermineSyntenicRegionAttributes,
        intermineSyntenicRegionSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineSyntenicRegionResponse) => response2syntenicRegions(response))
        .then((syntenicRegions: Array<GraphQLSyntenicRegion>) => {
            if (!syntenicRegions.length) {
                const msg = `SyntenicRegion with ID '${id}' not found`;
                this.inputError(msg);
            }
            return syntenicRegions[0];
        });
}
