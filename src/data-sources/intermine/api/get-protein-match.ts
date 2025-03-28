import {
    ApiResponse,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLProteinMatch,
    IntermineProteinMatchResponse,
    intermineProteinMatchAttributes,
    intermineProteinMatchSort,
    response2proteinMatches,
} from '../models/index.js';
import { bioEntityJoinFactory } from './bio-entity.js';


// get a ProteinMatch by identifier
export async function getProteinMatch(identifier: string):
Promise<ApiResponse<GraphQLProteinMatch>> {
    const constraints = [intermineConstraint('ProteinMatch.primaryIdentifier', '=', identifier)];
    const joins = bioEntityJoinFactory('ProteinMatch');
    const query = interminePathQuery(
        intermineProteinMatchAttributes,
        intermineProteinMatchSort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineProteinMatchResponse) => response2proteinMatches(response))
        .then((proteinMatchs: Array<GraphQLProteinMatch>) => {
            if (!proteinMatchs.length) return null;
            return proteinMatchs[0];
        })
        .then((proteinMatch: GraphQLProteinMatch) => ({data: proteinMatch}));
}
