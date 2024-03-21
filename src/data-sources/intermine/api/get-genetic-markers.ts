import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneticMarker,
    GraphQLGWASResult,
    GraphQLQTL,
    IntermineGeneticMarkerResponse,
    intermineGeneticMarkerAttributes,
    intermineGeneticMarkerSort,
    response2geneticMarkers,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetGeneticMarkersOptions = {
    qtl?: GraphQLQTL;
    gwasResult?: GraphQLGWASResult;
} & PaginationOptions;


// get GeneticMarkers for a QTL
export async function getGeneticMarkers(
    {
        qtl,
        gwasResult,
        page,
        pageSize,
    }: GetGeneticMarkersOptions,
): Promise<ApiResponse<GraphQLGeneticMarker[]>> {
    const constraints = [];
    if (qtl) {
        const constraint = intermineConstraint('GeneticMarker.qtls.id', '=', qtl.id);
        constraints.push(constraint);
    }
    if (gwasResult) {
        const constraint = intermineConstraint('GeneticMarker.gwasResults.id', '=', gwasResult.id);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        intermineGeneticMarkerAttributes,
        intermineGeneticMarkerSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneticMarkerResponse) => response2geneticMarkers(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
