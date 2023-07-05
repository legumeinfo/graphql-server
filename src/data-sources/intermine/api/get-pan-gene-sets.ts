import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    GraphQLPanGeneSet,
    GraphQLProtein,
    InterminePanGeneSetResponse,
    interminePanGeneSetAttributes,
    interminePanGeneSetSort,
    response2panGeneSets,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GenePanGeneSetsOptions = {
    gene?: GraphQLGene;
    protein?: GraphQLProtein;
} & PaginationOptions;


// get PanGeneSets for a Gene or Protein
export async function getPanGeneSets(
    {
        gene,
        protein,
        page,
        pageSize,
    }: GenePanGeneSetsOptions,
): Promise<ApiResponse<GraphQLPanGeneSet[]>> {
    const constraints = [];
    if (gene) {
        const geneConstraint = intermineConstraint('PanGeneSet.genes.id', '=', gene.id);
        constraints.push(geneConstraint);
    }
    if (protein) {
        const proteinConstraint = intermineConstraint('PanGeneSet.proteins.id', '=', protein.id);
        constraints.push(proteinConstraint);
    }
    const query = interminePathQuery(
        interminePanGeneSetAttributes,
        interminePanGeneSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: InterminePanGeneSetResponse) => response2panGeneSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'PanGeneSet.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
