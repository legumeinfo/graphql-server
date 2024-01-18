import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLMRNA,
    IntermineMRNAResponse,
    intermineMRNAAttributes,
    intermineMRNASort,
    response2mRNAs,
} from '../models/index.js';

// get an MRNA by identifier
export async function getMRNA(identifier: string):
Promise<ApiResponse<GraphQLMRNA>> {
    const constraints = [intermineConstraint('MRNA.primaryIdentifier', '=', identifier)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('MRNA.chromosome', 'OUTER'),
        intermineJoin('MRNA.supercontig', 'OUTER'),
        intermineJoin('MRNA.chromosomeLocation', 'OUTER'),
        intermineJoin('MRNA.supercontigLocation', 'OUTER'),
        intermineJoin('MRNA.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineMRNAAttributes,
        intermineMRNASort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineMRNAResponse) => response2mRNAs(response))
        .then((mRNAs: Array<GraphQLMRNA>) => {
            if (!mRNAs.length) return null;
            return mRNAs[0];
        })
        .then((mRNA: GraphQLMRNA) => ({data: mRNA}));
}
