import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneticMarker,
    GraphQLQTL,
    IntermineGeneticMarkerResponse,
    intermineGeneticMarkerAttributes,
    intermineGeneticMarkerSort,
    response2geneticMarkers,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetGeneticMarkersOptions = {
    qtl?: GraphQLQTL;
} & PaginationOptions;


// get GeneticMarkers for a QTL
export async function getGeneticMarkers(
    {
        qtl,
        start,
        size,
    }: GetGeneticMarkersOptions,
): Promise<ApiResponse<GraphQLGeneticMarker[]>> {
    const constraints = [];
    if (qtl) {
        const qtlConstraint = intermineConstraint('GeneticMarker.qtls.id', '=', qtl.id);
        constraints.push(qtlConstraint);
    }
    const query = interminePathQuery(
        intermineGeneticMarkerAttributes,
        intermineGeneticMarkerSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineGeneticMarkerResponse) => response2geneticMarkers(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GeneticMarker.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
