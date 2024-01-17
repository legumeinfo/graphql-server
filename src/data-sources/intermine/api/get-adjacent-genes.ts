import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    intermineIntergenicRegionAdjacentGeneAttributes,
    intermineIntergenicRegionAdjacentGeneSort,
    GraphQLGene,
    GraphQLIntergenicRegion,
    IntermineGeneResponse,
    response2genes,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetIntergenicRegionAdjacentGenesOptions = {
    intergenicRegion?: GraphQLIntergenicRegion;
} & PaginationOptions;

// get adjacent Genes for an IntergenicRegion
export async function getAdjacentGenes(
    {intergenicRegion, page, pageSize}: GetIntergenicRegionAdjacentGenesOptions,
): Promise<ApiResponse<GraphQLGene>> {
    const constraints = [
        intermineConstraint('IntergenicRegion.id', '=', intergenicRegion.id)
    ];
    // all Gene-extending object queries must include these joins
    const joins = [
        intermineJoin('IntergenicRegion.adjacentGenes.chromosome', 'OUTER'),
        intermineJoin('IntergenicRegion.adjacentGenes.supercontig', 'OUTER'),
        intermineJoin('IntergenicRegion.adjacentGenes.chromosomeLocation', 'OUTER'),
        intermineJoin('IntergenicRegion.adjacentGenes.supercontigLocation', 'OUTER'),
        intermineJoin('IntergenicRegion.adjacentGenes.sequenceOntologyTerm', 'OUTER'),
    ];
    const query = interminePathQuery(
        intermineIntergenicRegionAdjacentGeneAttributes,
        intermineIntergenicRegionAdjacentGeneSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'IntergenicRegion.adjacentGenes.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
