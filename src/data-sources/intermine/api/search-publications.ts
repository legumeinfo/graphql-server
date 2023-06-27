import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLPublication,
    InterminePublicationResponse,
    interminePublicationAttributes,
    interminePublicationSort,
    response2publications,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchPublicationsOptions = {
    title?: string;
} & PaginationOptions;


// path query search for Publications by title
export async function searchPublications(
    {
        title,
        page,
        pageSize,
    }: SearchPublicationsOptions,
): Promise<ApiResponse<GraphQLPublication[]>> {
    const constraints = [];
    if (title) {
        const constraint = intermineConstraint('Publication.title', 'CONTAINS', title);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        interminePublicationAttributes,
        interminePublicationSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: InterminePublicationResponse) => response2publications(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Publication.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
