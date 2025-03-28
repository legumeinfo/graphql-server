import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGenotypingPlatform,
    IntermineGenotypingPlatformResponse,
    intermineGenotypingPlatformAttributes,
    intermineGenotypingPlatformSort,
    response2genotypingPlatforms,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get GenotypingPlatforms for a GeneticMarker
export async function getGenotypingPlatformsForGeneticMarker(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGenotypingPlatform>> {
    const constraints = [intermineConstraint('GenotypingPlatform.markers.id', '=', id)];
    const query = interminePathQuery(
        intermineGenotypingPlatformAttributes,
        intermineGenotypingPlatformSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGenotypingPlatformResponse) => response2genotypingPlatforms(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
