import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLProteinDomain,
  IntermineProteinDomainResponse,
  intermineProteinDomainAttributes,
  intermineProteinDomainSort,
  response2proteinDomains,
} from '../models/index.js';

// get a ProteinDomain by identifier
export async function getProteinDomain(identifier: string):
Promise<ApiResponse<GraphQLProteinDomain>> {
    const constraints = [intermineConstraint('ProteinDomain.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineProteinDomainAttributes,
        intermineProteinDomainSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineProteinDomainResponse) => response2proteinDomains(response))
        .then((proteinDomains: Array<GraphQLProteinDomain>) => {
            if (!proteinDomains.length) return null;
            return proteinDomains[0];
        })
        .then((proteinDomain: GraphQLProteinDomain) => ({data: proteinDomain}));
}
