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

// get GeneticMarkers for a QTL
export async function getGeneticMarkersForQTL(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGeneticMarker>> {
    const constraints = [intermineConstraint('GeneticMarker.qtls.id', '=', id)];
    const query = interminePathQuery(
        intermineGeneticMarkerAttributes,
        intermineGeneticMarkerSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneticMarkerResponse) => response2geneticMarkers(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GeneticMarker.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get GeneticMarkers for a GWASResult
export async function getGeneticMarkersForGWASResult(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGeneticMarker>> {
    const constraints = [intermineConstraint('GeneticMarker.gwasResults.id', '=', id)];
    const query = interminePathQuery(
        intermineGeneticMarkerAttributes,
        intermineGeneticMarkerSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneticMarkerResponse) => response2geneticMarkers(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GeneticMarker.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
