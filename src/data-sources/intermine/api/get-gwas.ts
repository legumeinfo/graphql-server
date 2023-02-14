import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGWAS,
  IntermineGWASResponse,
  intermineGWASAttributes,
  intermineGWASSort,
  response2gwas,
} from '../models/index.js';


// get a GWAS by ID
export async function getGWAS(id: number): Promise<GraphQLGWAS> {
    const constraints = [intermineConstraint('GWAS.id', '=', id)];
    const query = interminePathQuery(
        intermineGWASAttributes,
        intermineGWASSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGWASResponse) => response2gwas(response))
        .then((gwases: Array<GraphQLGWAS>) => {
            if (!gwases.length) {
                const msg = `GWAS with ID '${id}' not found`;
                this.inputError(msg);
            }
            return gwases[0];
        });
}
