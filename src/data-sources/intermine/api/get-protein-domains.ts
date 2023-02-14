import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGene,
  GraphQLGeneFamily,
  GraphQLProteinDomain,
  IntermineProteinDomainResponse,
  intermineProteinDomainAttributes,
  intermineProteinDomainSort,
  response2proteinDomains,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type GetProteinDomainsOptions = {
  gene?: GraphQLGene;
  geneFamily?: GraphQLGeneFamily;
} & PaginationOptions;


// get ProteinDomains for a Gene, GeneFamily
export async function getProteinDomains(
  {
    gene,
    geneFamily,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: GetProteinDomainsOptions,
): Promise<GraphQLProteinDomain[]> {
    const constraints = [];
    if (gene) {
        const geneConstraint = intermineConstraint('ProteinDomain.genes.id', '=', gene.id);
        constraints.push(geneConstraint);
    }
    if (geneFamily) {
        const geneFamilyConstraint = intermineConstraint('ProteinDomain.geneFamilies.id', '=', geneFamily.id);
        constraints.push(geneFamilyConstraint);
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
