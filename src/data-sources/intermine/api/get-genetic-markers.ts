import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
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
): Promise<GraphQLGeneticMarker[]> {
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
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineGeneticMarkerResponse) => response2geneticMarkers(response));
}
