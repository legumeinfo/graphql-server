import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
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
import { PaginationOptions } from './pagination.js';


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
    start,
    size,
  }: GetGenesOptions,
): Promise<ApiResponse<GraphQLGene[]>> {
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
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Gene.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
