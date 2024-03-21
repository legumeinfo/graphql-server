import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    GraphQLGeneFamily,
    GraphQLPanGeneSet,
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
    panGeneSet?: GraphQLPanGeneSet;
    proteinDomain?: GraphQLProteinDomain;
} & PaginationOptions;


// get Genes associated with a Protein, GeneFamily, PanGeneSet, ProteinDomain
export async function getGenes(
    {
        protein,
        geneFamily,
        panGeneSet,
        proteinDomain,
        page,
        pageSize,
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
    if (panGeneSet) {
        const panGeneSetConstraint = intermineConstraint('Gene.panGeneSets.id', '=', panGeneSet.id);
        constraints.push(panGeneSetConstraint);
    }
    if (proteinDomain) {
        const proteinDomainConstraint = intermineConstraint('Gene.proteinDomains.id', '=', proteinDomain.id);
        constraints.push(proteinDomainConstraint);
    }
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
