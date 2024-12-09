import {
    ApiResponse,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLSyntenicRegion,
    IntermineSyntenicRegionResponse,
    intermineSyntenicRegionAttributes,
    intermineSyntenicRegionSort,
    response2syntenicRegions,
} from '../models/index.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';


// get a SyntenicRegion by identifier
export async function getSyntenicRegion(identifier: string):
Promise<ApiResponse<GraphQLSyntenicRegion>> {
    const constraints = [intermineConstraint('SyntenicRegion.primaryIdentifier', '=', identifier)];
    const joins = sequenceFeatureJoinFactory('SyntenicRegion');
    const query = interminePathQuery(
        intermineSyntenicRegionAttributes,
        intermineSyntenicRegionSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineSyntenicRegionResponse) => response2syntenicRegions(response))
        .then((syntenicRegions: Array<GraphQLSyntenicRegion>) => {
            if (!syntenicRegions.length) return null;
            return syntenicRegions[0];
        })
        .then((syntenicRegion: GraphQLSyntenicRegion) => ({data: syntenicRegion}));
}
