import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLGWAS,
  IntermineGWASResponse,
  intermineGWASAttributes,
  intermineGWASSort,
  response2gwas,
} from '../models/index.js';


// get a GWAS by identifier
export async function getGWAS(identifier: string):
Promise<ApiResponse<GraphQLGWAS>> {
    const constraints = [intermineConstraint('GWAS.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineGWASAttributes,
        intermineGWASSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGWASResponse) => response2gwas(response))
        .then((gwases: Array<GraphQLGWAS>) => {
            if (!gwases.length) return null;
            return gwases[0];
        })
        .then((gwas: GraphQLGWAS) => ({data: gwas}));
}
