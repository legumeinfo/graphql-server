import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    GraphQLGeneFamily,
    GraphQLPanGeneSet,
    GraphQLPathway,
    GraphQLProtein,
    GraphQLProteinDomain,
    IntermineGeneResponse,
    intermineGeneAttributes,
    intermineGeneSort,
    response2genes,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetGenesOptions = {
    geneFamily?: GraphQLGeneFamily;
    panGeneSet?: GraphQLPanGeneSet;
    pathway?: GraphQLPathway;
    protein?: GraphQLProtein;
    proteinDomain?: GraphQLProteinDomain;
} & PaginationOptions;

// get Genes associated with a GeneFamily, PanGeneSet, Pathway, Protein, or ProteinDomain
export async function getGenes(
    {
        geneFamily,
        panGeneSet,
        pathway,
        protein,
        proteinDomain,
        page,
        pageSize,
    }: GetGenesOptions,
): Promise<ApiResponse<GraphQLGene[]>> {
    const constraints = [];
    if (geneFamily) {
        constraints.push(intermineConstraint('Gene.geneFamilyAssignments.geneFamily.id', '=', geneFamily.id));
    }
    if (panGeneSet) {
        constraints.push(intermineConstraint('Gene.panGeneSets.id', '=', panGeneSet.id));
    }
    if (pathway) {
        constraints.push(intermineConstraint('Gene.pathways.id', '=', pathway.id));
    }
    if (protein) {
        constraints.push(intermineConstraint('Gene.proteins.id', '=', protein.id));
    }
    if (proteinDomain) {
        constraints.push(intermineConstraint('Gene.proteinDomains.id', '=', proteinDomain.id));
    }
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('Gene.chromosome', 'OUTER'),
        intermineJoin('Gene.supercontig', 'OUTER'),
        intermineJoin('Gene.chromosomeLocation', 'OUTER'),
        intermineJoin('Gene.supercontigLocation', 'OUTER'),
        intermineJoin('Gene.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Gene.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
