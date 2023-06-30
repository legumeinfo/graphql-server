import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLProtein,
    IntermineProteinResponse,
    intermineProteinAttributes,
    intermineProteinSort,
    response2proteins,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchProteinsOptions = {
    description?: string;
} & PaginationOptions;


// path query search for Protein by description
export async function searchProteins(
    {
        description,
        start,
        size,
    }: SearchProteinsOptions,
): Promise<ApiResponse<GraphQLProtein[]>> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('Protein.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineProteinAttributes,
        intermineProteinSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineProteinResponse) => response2proteins(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Protein.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
