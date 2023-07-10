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
    GraphQLQTL,
    IntermineGeneticMarkerResponse,
    intermineGeneticMarkerAttributes,
    intermineGeneticMarkerSort,
    response2geneticMarkers,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetGeneticMarkersOptions = {
    qtl?: GraphQLQTL;
    genotypingPlatform?: GraphQLGenotypingPlatform;
} & PaginationOptions;


// get GeneticMarkers for a QTL or GenotypingPlatform
export async function getGeneticMarkers(
    {
        qtl,
        genotypingPlatform,
        page,
        pageSize,
    }: GetGeneticMarkersOptions,
): Promise<ApiResponse<GraphQLGeneticMarker[]>> {
    const constraints = [];
    if (qtl) {
        const constraint = intermineConstraint('GeneticMarker.qtls.id', '=', qtl.id);
        constraints.push(constraint);
    }
    if (genotypingPlatform) { 
        const constraint = intermineConstraint('GeneticMarker.genotypingPlatforms.id', '=', genotypingPlatform.id);
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
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GeneticMarker.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
