import {
    ApiResponse,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLUTR,
    IntermineUTRResponse,
    intermineUTRAttributes,
    intermineUTRSort,
    response2utrs,
} from '../models/index.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';

// get a UTR by identifier
export async function getUTR(identifier: string):
Promise<ApiResponse<GraphQLUTR>> {
    const constraints = [intermineConstraint('UTR.primaryIdentifier', '=', identifier)];
    const joins = sequenceFeatureJoinFactory('UTR');
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
