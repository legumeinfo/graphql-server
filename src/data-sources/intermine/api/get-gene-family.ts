import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneFamily,
  IntermineGeneFamilyResponse,
  intermineGeneFamilyAttributes,
  intermineGeneFamilySort,
  response2geneFamilies,
} from '../models/index.js';


// get a GeneFamily by ID
export async function getGeneFamily(id: number): Promise<GraphQLGeneFamily> {
    const constraints = [intermineConstraint('GeneFamily.id', '=', id)];
    const query = interminePathQuery(
        intermineGeneFamilyAttributes,
        intermineGeneFamilySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneFamilyResponse) => response2geneFamilies(response))
        .then((geneFamilies: Array<GraphQLGeneFamily>) => {
            if (!geneFamilies.length) {
                const msg = `GeneFamily with ID '${id}' not found`;
                this.inputError(msg);
            }
            return geneFamilies[0];
        });
}