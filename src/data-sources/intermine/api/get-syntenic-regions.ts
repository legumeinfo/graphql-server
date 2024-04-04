import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLSyntenicRegion,
    IntermineSyntenicRegionResponse,
    intermineSyntenicRegionAttributes,
    intermineSyntenicRegionSort,
    response2syntenicRegions,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';

// get SyntenicRegions associated with a SyntenyBlock
export async function getSyntenicRegionsForSyntenyBlock(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLSyntenicRegion>> {
    const constraints = [intermineConstraint('SyntenicRegion.syntenyBlock.id', '=', id)];
    const joins = sequenceFeatureJoinFactory('SyntenicRegion');
    const query = interminePathQuery(
        intermineSyntenicRegionAttributes,
        intermineSyntenicRegionSort,
        constraints,
        joins,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineSyntenicRegionResponse) => response2syntenicRegions(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'SyntenicRegion.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
