import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
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
): Promise<GraphQLSyntenicRegion[]> {
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
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineSyntenicRegionResponse) => response2syntenicRegions(response));
}
