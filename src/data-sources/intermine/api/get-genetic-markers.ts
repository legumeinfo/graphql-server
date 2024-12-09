import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneticMarker,
    IntermineGeneticMarkerResponse,
    intermineGeneticMarkerAttributes,
    intermineGeneticMarkerSort,
    response2geneticMarkers,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';
import { sequenceFeatureJoinFactory } from './sequence-feature.js';

// get GeneticMarkers using the given query and returns the expected GraphQL types
async function getGeneticMarkers(pathQuery: string, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGeneticMarker>> {
    // get the data
    const dataPromise = this.pathQuery(pathQuery, {page, pageSize})
        .then((response: IntermineGeneticMarkerResponse) => response2geneticMarkers(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(pathQuery, {summaryPath: 'GeneticMarker.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get GeneticMarkers for a GenotypingPlatform
export async function getGeneticMarkersForGenotypingPlatform(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGeneticMarker>> {
    const constraints = [intermineConstraint('GeneticMarker.genotypingPlatforms.id', '=', id)];
    const joins = sequenceFeatureJoinFactory('GeneticMarker');
    const query = interminePathQuery(
        intermineGeneticMarkerAttributes,
        intermineGeneticMarkerSort,
        constraints,
        joins,
    );
    // get the data
    return getGeneticMarkers.call(this, query, { page, pageSize });
}

// get GeneticMarkers for a QTL
export async function getGeneticMarkersForQTL(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGeneticMarker>> {
    const constraints = [intermineConstraint('GeneticMarker.qtls.id', '=', id)];
    const joins = sequenceFeatureJoinFactory('GeneticMarker');
    const query = interminePathQuery(
        intermineGeneticMarkerAttributes,
        intermineGeneticMarkerSort,
        constraints,
        joins,
    );
    // get the data
    return getGeneticMarkers.call(this, query, { page, pageSize });
}

// get GeneticMarkers for a GWASResult
export async function getGeneticMarkersForGWASResult(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGeneticMarker>> {
    const constraints = [intermineConstraint('GeneticMarker.gwasResults.id', '=', id)];
    const joins = sequenceFeatureJoinFactory('GeneticMarker');
    const query = interminePathQuery(
        intermineGeneticMarkerAttributes,
        intermineGeneticMarkerSort,
        constraints,
        joins,
    );
    // get the data
    return getGeneticMarkers.call(this, query, { page, pageSize });
}
