import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLProteinDomain,
  IntermineProteinDomainResponse,
  intermineProteinDomainAttributes,
  intermineProteinDomainSort,
  response2proteinDomains,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type SearchProteinDomainsOptions = {
  description?: string;
} & PaginationOptions;


// path query search for ProteinDomain by description
export async function searchProteinDomains(
  {
    description,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: SearchProteinDomainsOptions,
): Promise<GraphQLProteinDomain[]> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('ProteinDomain.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineProteinDomainAttributes,
        intermineProteinDomainSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineProteinDomainResponse) => response2proteinDomains(response));
}
