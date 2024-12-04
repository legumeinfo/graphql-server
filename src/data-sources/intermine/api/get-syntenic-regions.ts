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

// get SyntenicRegions associated with a SyntenyBlock
export async function getSyntenicRegionsForSyntenyBlock(id: number): Promise<ApiResponse<GraphQLSyntenicRegion>> {
    const constraints = [intermineConstraint('SyntenicRegion.syntenyBlock.id', '=', id)];
    const joins = sequenceFeatureJoinFactory('SyntenicRegion');
    const query = interminePathQuery(
        intermineSyntenicRegionAttributes,
        intermineSyntenicRegionSort,
        constraints,
        joins,
    );
    // get the data
    return this.pathQuery(query)
        .then((response: IntermineSyntenicRegionResponse) => {
            const data = response2syntenicRegions(response);
            return {data, metadata: {}};
        });
}
