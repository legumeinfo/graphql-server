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
    GraphQLPanGeneSet,
    GraphQLProtein,
    IntermineProteinResponse,
    intermineProteinAttributes,
    intermineProteinSort,
    response2proteins,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetProteinsOptions = {
    gene?: GraphQLGene;
    geneFamily?: GraphQLGeneFamily;
    panGeneSet?: GraphQLPanGeneSet;
} & PaginationOptions;


// get Proteins associated with a Gene or GeneFamily or PanGeneSet
export async function getProteins(
    {
        gene,
        geneFamily,
        panGeneSet,
        page,
        pageSize,
    }: GetProteinsOptions,
): Promise<ApiResponse<GraphQLProtein[]>> {
    const constraints = [];
    if (gene) {
        const geneConstraint = intermineConstraint('Protein.genes.id', '=', gene.id);
        constraints.push(geneConstraint);
    }
    if (geneFamily) {
        const geneFamilyConstraint = intermineConstraint('Protein.geneFamilyAssignments.geneFamily.id', '=', geneFamily.id);
        constraints.push(geneFamilyConstraint);
    }
    if (panGeneSet) {
        const panGeneSetConstraint = intermineConstraint('Protein.panGeneSets.id', '=', panGeneSet.id);
        constraints.push(panGeneSetConstraint);
    }
    const query = interminePathQuery(
        intermineProteinAttributes,
        intermineProteinSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineProteinResponse) => response2proteins(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Protein.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
