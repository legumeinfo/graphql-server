import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneFlankingRegion,
    IntermineGeneFlankingRegionResponse,
    intermineGeneFlankingRegionAttributes,
    intermineGeneFlankingRegionSort,
    response2geneFlankingRegions,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// Get GeneFlankingRegions associated with a Gene
export async function getGeneFlankingRegionsForGene(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGeneFlankingRegion>> {
    const constraints = [intermineConstraint('GeneFlankingRegion.gene.id', '=', id)];
    // all SequenceFeature-extending object queries must include these joins
    const joins = [
        intermineJoin('GeneFlankingRegion.chromosome', 'OUTER'),
        intermineJoin('GeneFlankingRegion.supercontig', 'OUTER'),
        intermineJoin('GeneFlankingRegion.chromosomeLocation', 'OUTER'),
        intermineJoin('GeneFlankingRegion.supercontigLocation', 'OUTER'),
        intermineJoin('GeneFlankingRegion.sequenceOntologyTerm', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineGeneFlankingRegionAttributes,
        intermineGeneFlankingRegionSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneFlankingRegionResponse) => response2geneFlankingRegions(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GeneFlankingRegion.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
