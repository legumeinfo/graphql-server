import {
    ApiResponse,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLGeneFlankingRegion,
    IntermineGeneFlankingRegionResponse,
    intermineGeneFlankingRegionAttributes,
    intermineGeneFlankingRegionSort,
    response2geneFlankingRegions,
} from '../models/index.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';

// get a GeneFlankingRegion by identifier
export async function getGeneFlankingRegion(identifier: string):
Promise<ApiResponse<GraphQLGeneFlankingRegion>> {
    const constraints = [intermineConstraint('GeneFlankingRegion.primaryIdentifier', '=', identifier)];
    const joins = sequenceFeatureJoinFactory('GeneFlankingRegion');
    const query = interminePathQuery(
        intermineGeneFlankingRegionAttributes,
        intermineGeneFlankingRegionSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneFlankingRegionResponse) => response2geneFlankingRegions(response))
        .then((geneFlankingRegions: Array<GraphQLGeneFlankingRegion>) => {
            if (!geneFlankingRegions.length) return null;
            return geneFlankingRegions[0];
        })
        .then((geneFlankingRegion: GraphQLGeneFlankingRegion) => ({data: geneFlankingRegion}));
}
