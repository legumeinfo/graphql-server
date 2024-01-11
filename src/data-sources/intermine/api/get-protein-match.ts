import {
  ApiResponse,
  intermineConstraint,
  intermineJoin,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLProteinMatch,
  IntermineProteinMatchResponse,
  intermineProteinMatchAttributes,
  intermineProteinMatchSort,
  response2proteinMatches,
} from '../models/index.js';


// get a ProteinMatch by identifier
export async function getProteinMatch(identifier: string):
Promise<ApiResponse<GraphQLProteinMatch>> {
    const constraints = [intermineConstraint('ProteinMatch.primaryIdentifier', '=', identifier)];
    // all BioEntity-extending object queries must include these joins
    const joins = [
        intermineJoin('ProteinMatch.organism', 'OUTER'),
        intermineJoin('ProteinMatch.strain', 'OUTER')
    ];
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
