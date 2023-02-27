import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGene,
  IntermineGeneResponse,
  intermineGeneAttributes,
  intermineGeneSort,
  response2genes,
} from '../models/index.js';


// get a Gene by ID
export async function getGene(identifier: string): Promise<GraphQLGene> {
    const constraints = [intermineConstraint('Gene.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneResponse) => response2genes(response))
        .then((genes: Array<GraphQLGene>) => {
            if (!genes.length) {
                const msg = `Gene with primaryIdentifier '${identifier}' not found`;
                this.inputError(msg);
            }
            return genes[0];
        });
}
