import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLGWAS,
  GraphQLTrait,
  IntermineGWASResponse,
  intermineGWASAttributes,
  intermineGWASSort,
  response2gwas,
} from '../models/index.js';


// get the GWAS for a Trait
export async function getGWASForTrait(trait: GraphQLTrait):
Promise<ApiResponse<GraphQLGWAS|null>> {
    const constraints = [intermineConstraint('GWAS.results.trait.id', '=', trait.id)];
    const query = interminePathQuery(
        intermineGWASAttributes,
        intermineGWASSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGWASResponse) => response2gwas(response))
        .then((gwases: Array<GraphQLGWAS>) => {
            if (gwases.length) {
                return gwases[0];
            } else {
                return null;
            }
        })
        .then((gwas: GraphQLGWAS) => ({data: gwas}));
}
