import {
    ApiResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLUTR,
    IntermineUTRResponse,
    intermineUTRAttributes,
    intermineUTRSort,
    response2utrs,
} from '../models/index.js';

// get a UTR by identifier
export async function getUTR(identifier: string):
Promise<ApiResponse<GraphQLUTR>> {
    const constraints = [intermineConstraint('UTR.primaryIdentifier', '=', identifier)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('UTR.chromosome', 'OUTER'),
        intermineJoin('UTR.supercontig', 'OUTER'),
        intermineJoin('UTR.chromosomeLocation', 'OUTER'),
        intermineJoin('UTR.supercontigLocation', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineUTRAttributes,
        intermineUTRSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineUTRResponse) => response2utrs(response))
        .then((utrs: Array<GraphQLUTR>) => {
            if (!utrs.length) return null;
            return utrs[0];
        })
        .then((utr: GraphQLUTR) => ({data: utr}));
}
