import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLSyntenicRegion,
    GraphQLSyntenyBlock,
    IntermineSyntenicRegionResponse,
    intermineSyntenicRegionAttributes,
    intermineSyntenicRegionSort,
    response2syntenicRegions,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetSyntenicRegionsOptions = {
    syntenyBlock?: GraphQLSyntenyBlock;
} & PaginationOptions;


// get SyntenicRegions associated with a SyntenyBlock
export async function getSyntenicRegions(
    {
        syntenyBlock,
        start,
        size,
    }: GetSyntenicRegionsOptions,
): Promise<ApiResponse<GraphQLSyntenicRegion[]>> {
    const constraints = [];
    if (syntenyBlock) {
        const constraint = intermineConstraint('SyntenicRegion.syntenyBlock.id', '=', syntenyBlock.id);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        intermineSyntenicRegionAttributes,
        intermineSyntenicRegionSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineSyntenicRegionResponse) => response2syntenicRegions(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'SyntenicRegion.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
