import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLGeneFlankingRegion,
    IntermineGeneFlankingRegionResponse,
    intermineGeneFlankingRegionAttributes,
    intermineGeneFlankingRegionSort,
    response2geneFlankingRegions,
} from '../models/index.js';

// get a GeneFlankingRegion by identifier
export async function getGeneFlankingRegion(identifier: string):
Promise<ApiResponse<GraphQLGeneFlankingRegion>> {
    const constraints = [intermineConstraint('GeneFlankingRegion.primaryIdentifier', '=', identifier)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('GeneFlankingRegion.chromosome', 'OUTER'),
        intermineJoin('GeneFlankingRegion.supercontig', 'OUTER'),
        intermineJoin('GeneFlankingRegion.chromosomeLocation', 'OUTER'),
        intermineJoin('GeneFlankingRegion.supercontigLocation', 'OUTER')
    ];
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
