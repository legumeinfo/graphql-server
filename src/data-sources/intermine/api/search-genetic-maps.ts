import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneticMap,
    IntermineGeneticMapResponse,
    intermineGeneticMapAttributes,
    intermineGeneticMapSort,
    response2geneticMaps,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchGeneticMapsOptions = {
    description?: string;
} & PaginationOptions;


// path query search for GeneticMap by description
export async function searchGeneticMaps(
    {
        description,
        start,
        size,
    }: SearchGeneticMapsOptions,
): Promise<ApiResponse<GraphQLGeneticMap[]>> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('GeneticMap.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineGeneticMapAttributes,
        intermineGeneticMapSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineGeneticMapResponse) => response2geneticMaps(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GeneticMap.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
