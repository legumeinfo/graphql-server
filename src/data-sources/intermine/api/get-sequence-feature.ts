import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLSequenceFeature,
    IntermineSequenceFeatureResponse,
    intermineSequenceFeatureAttributes,
    intermineSequenceFeatureSort,
    response2sequenceFeatures,
} from '../models/index.js';

// get an SequenceFeature by id (for internal resolution of collections and references)
export async function getSequenceFeature(id: number):
Promise<ApiResponse<GraphQLSequenceFeature>> {
    const constraints = [intermineConstraint('SequenceFeature.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('SequenceFeature.chromosome', 'OUTER'),
        intermineJoin('SequenceFeature.supercontig', 'OUTER'),
        intermineJoin('SequenceFeature.chromosomeLocation', 'OUTER'),
        intermineJoin('SequenceFeature.supercontigLocation', 'OUTER'),
        intermineJoin('SequenceFeature.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineSequenceFeatureAttributes,
        intermineSequenceFeatureSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineSequenceFeatureResponse) => response2sequenceFeatures(response))
        .then((sequenceFeatures: Array<GraphQLSequenceFeature>) => {
            if (!sequenceFeatures.length) return null;
            return sequenceFeatures[0];
        })
        .then((sequenceFeature: GraphQLSequenceFeature) => ({data: sequenceFeature}));
}
