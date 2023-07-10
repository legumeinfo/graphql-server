import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneticMarker,
    GraphQLGenotypingPlatform,
    IntermineGenotypingPlatformResponse,
    intermineGenotypingPlatformAttributes,
    intermineGenotypingPlatformSort,
    response2genotypingPlatforms,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchGenotypingPlatformsOptions = {
    geneticMarker?: GraphQLGeneticMarker;
} & PaginationOptions;


// get GenotypingPlatforms for a GeneticMarker
export async function getGenotypingPlatforms(
    {geneticMarker, page, pageSize}: SearchGenotypingPlatformsOptions,
): Promise<ApiResponse<GraphQLGenotypingPlatform[]>> {
    const constraints = [];
    if (geneticMarker) {
        const constraint = intermineConstraint('GenotypingPlatform.markers.id', '=', geneticMarker.id);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        intermineGenotypingPlatformAttributes,
        intermineGenotypingPlatformSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGenotypingPlatformResponse) => response2genotypingPlatforms(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GenotypingPlatform.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
