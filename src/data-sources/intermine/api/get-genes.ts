import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGene,
  GraphQLGeneFamily,
  GraphQLProtein,
  GraphQLProteinDomain,
  IntermineGeneResponse,
  intermineGeneAttributes,
  intermineGeneSort,
  response2genes,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type GetGenesOptions = {
  protein?: GraphQLProtein;
  geneFamily?: GraphQLGeneFamily;
  proteinDomain?: GraphQLProteinDomain;
} & PaginationOptions;


// get Genes associated with a Protein, GeneFamily, ProteinDomain
export async function getGenes(
  {
    protein,
    geneFamily,
    proteinDomain,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: GetGenesOptions,
): Promise<GraphQLGene> {
    const constraints = [];
    if (protein) {
        const proteinConstraint = intermineConstraint('Gene.proteins.id', '=', protein.id);
        constraints.push(proteinConstraint);
    }
    if (geneFamily) {
        const geneFamilyConstraint = intermineConstraint('Gene.geneFamilyAssignments.geneFamily.id', '=', geneFamily.id);
        constraints.push(geneFamilyConstraint);
    }
    if (proteinDomain) {
        const proteinDomainConstraint = intermineConstraint('Gene.proteinDomains.id', '=', proteinDomain.id);
        constraints.push(proteinDomainConstraint);
    }
    // if (strain) {
    //     const strainConstraint =
    //           intermineConstraint('Gene.strain.name', '=', strain);
    //     constraints.push(strainConstraint);
    // }
    // if (description) {
    //     const descriptionConstraint =
    //           intermineConstraint('Gene.description', 'CONTAINS', description);
    //     constraints.push(descriptionConstraint);
    // }
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineGeneResponse) => response2genes(response));
}
