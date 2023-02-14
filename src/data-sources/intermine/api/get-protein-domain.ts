import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLProteinDomain,
  IntermineProteinDomainResponse,
  intermineProteinDomainAttributes,
  intermineProteinDomainSort,
  response2proteinDomains,
} from '../models/index.js';


// get a ProteinDomain by ID
export async function getProteinDomain(id: number): Promise<GraphQLProteinDomain> {
    const constraints = [intermineConstraint('ProteinDomain.id', '=', id)];
    const query = interminePathQuery(
        intermineProteinDomainAttributes,
        intermineProteinDomainSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineProteinDomainResponse) => response2proteinDomains(response))
        .then((proteinDomains: Array<GraphQLProteinDomain>) => {
            if (!proteinDomains.length) {
                const msg = `ProteinDomain with ID '${id}' not found`;
                this.inputError(msg);
            }
            return proteinDomains[0];
        });
}
