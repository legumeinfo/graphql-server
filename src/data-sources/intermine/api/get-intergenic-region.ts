import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLIntergenicRegion,
    IntermineIntergenicRegionResponse,
    intermineIntergenicRegionAttributes,
    intermineIntergenicRegionSort,
    response2intergenicRegions,
} from '../models/index.js';

// get an IntergenicRegion by identifier
export async function getIntergenicRegion(identifier: string):
Promise<ApiResponse<GraphQLIntergenicRegion>> {
    const constraints = [intermineConstraint('IntergenicRegion.primaryIdentifier', '=', identifier)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('IntergenicRegion.chromosome', 'OUTER'),
        intermineJoin('IntergenicRegion.supercontig', 'OUTER'),
        intermineJoin('IntergenicRegion.chromosomeLocation', 'OUTER'),
        intermineJoin('IntergenicRegion.supercontigLocation', 'OUTER'),
        intermineJoin('IntergenicRegion.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineIntergenicRegionAttributes,
        intermineIntergenicRegionSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineIntergenicRegionResponse) => response2intergenicRegions(response))
        .then((intergenicRegions: Array<GraphQLIntergenicRegion>) => {
            if (!intergenicRegions.length) return null;
            return intergenicRegions[0];
        })
        .then((intron: GraphQLIntergenicRegion) => ({data: intron}));
}
