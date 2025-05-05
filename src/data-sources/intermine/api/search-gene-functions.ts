import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneFunction,
    IntermineGeneFunctionResponse,
    intermineGeneFunctionAttributes,
    intermineGeneFunctionSort,
    response2genefunctions,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchGeneFunctionsOptions = {
    synopsis?: string;
} & PaginationOptions;


// path query search for GeneFunction by synopsis
export async function searchGeneFunctions(
    {
        synopsis,
        page,
        pageSize,
    }: SearchGeneFunctionsOptions,
): Promise<ApiResponse<GraphQLGeneFunction[]>> {
    const constraints = [];
    if (synopsis) {
        const synopsisConstraint = intermineConstraint('GeneFunction.synopsis', 'CONTAINS', synopsis);
        constraints.push(synopsisConstraint);
    }
    const query = interminePathQuery(
        intermineGeneFunctionAttributes,
        intermineGeneFunctionSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneFunctionResponse) => response2genefunctions(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
