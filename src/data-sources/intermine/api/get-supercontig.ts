import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLSequenceFeature,
    IntermineSequenceFeatureResponse,
    intermineSupercontigAttributes,
    intermineSupercontigSort,
    response2sequenceFeatures,
} from '../models/index.js';

// get a Supercontig for a given primaryIdentifier
export async function getSupercontig(identifier: string):
Promise<ApiResponse<GraphQLSequenceFeature>> {
    const constraints = [intermineConstraint('Supercontig.primaryIdentifier', '=', (identifier === null) ? '' : identifier)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Supercontig.chromosome', 'OUTER'),
        intermineJoin('Supercontig.supercontig', 'OUTER'),
        intermineJoin('Supercontig.chromosomeLocation', 'OUTER'),
        intermineJoin('Supercontig.supercontigLocation', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineSupercontigAttributes,
        intermineSupercontigSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineSequenceFeatureResponse) => response2sequenceFeatures(response))
        .then((supercontigs: Array<GraphQLSequenceFeature>) => {
            if (!supercontigs.length) return null;
            return supercontigs[0];
        })
        .then((supercontig: GraphQLSequenceFeature) => ({data: supercontig}));
}
