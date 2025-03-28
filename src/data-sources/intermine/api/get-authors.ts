import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo
} from '../intermine.server.js';
import {
    GraphQLAuthor,
    IntermineAuthorResponse,
    intermineAuthorAttributes,
    intermineAuthorSort,
    response2authors,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get Authors associated with an Publication
export async function getAuthorsForPublication(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLAuthor>> {
    const constraints = [intermineConstraint('Author.publications.id', '=', id)];
    const query = interminePathQuery(
        intermineAuthorAttributes,
        intermineAuthorSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineAuthorResponse) => response2authors(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
