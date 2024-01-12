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
    GraphQLQTL,
    IntermineGeneResponse,
    intermineQTLGenesAttributes,
    intermineQTLGenesSort,
    response2genes,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetQTLGenesOptions = {
    qtl?: GraphQLQTL;
} & PaginationOptions;

// get Genes associated with a QTL, for which there is no reverse reference from Gene
export async function getQTLGenes(
    {
        qtl,
        page,
        pageSize,
    }: GetQTLGenesOptions,
): Promise<ApiResponse<GraphQLGene[]>> {
    const constraints = [intermineConstraint('QTL.id', '=', qtl.id)];
    const joins = [
        intermineJoin('QTL.genes.chromosome', 'OUTER'),
        intermineJoin('QTL.genes.supercontig', 'OUTER'),
        intermineJoin('QTL.genes.chromosomeLocation', 'OUTER'),
        intermineJoin('QTL.genes.supercontigLocation', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineQTLGenesAttributes,
        intermineQTLGenesSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'QTL.genes.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
