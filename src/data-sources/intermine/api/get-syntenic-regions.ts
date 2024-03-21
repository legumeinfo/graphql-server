import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
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
        page,
        pageSize,
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
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineSyntenicRegionResponse) => response2syntenicRegions(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
