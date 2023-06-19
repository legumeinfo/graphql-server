import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGWAS,
    IntermineGWASResponse,
    intermineGWASAttributes,
    intermineGWASSort,
    response2gwas,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchGWASesOptions = {
    description?: string;
} & PaginationOptions;


// path query search for GWAS by description
export async function searchGWASes(
    {
        description,
        start,
        size,
    }: SearchGWASesOptions,
): Promise<ApiResponse<GraphQLGWAS[]>> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('GWAS.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineGWASAttributes,
        intermineGWASSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineGWASResponse) => response2gwas(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GWAS.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
