import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLQTL,
  IntermineQTLResponse,
  intermineQTLAttributes,
  intermineQTLSort,
  response2qtls,
} from '../models/index.js';

// get a QTL by primaryIdentifier
export async function getQTL(identifier: string):
Promise<ApiResponse<GraphQLQTL>> {
    const constraints = [intermineConstraint('QTL.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineQTLAttributes,
        intermineQTLSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineQTLResponse) => response2qtls(response))
        .then((qtls: Array<GraphQLQTL>) => {
            if (!qtls.length) return null;
            return qtls[0];
        })
        .then((qtl: GraphQLQTL) => ({data: qtl}));
}
