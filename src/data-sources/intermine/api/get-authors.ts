import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo
} from '../intermine.server.js';
import {
    GraphQLAuthor,
    GraphQLPublication,
    IntermineAuthorResponse,
    intermineAuthorAttributes,
    intermineAuthorSort,
    response2authors,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetAuthorsOptions = {
    publication?: GraphQLPublication;
} & PaginationOptions;


// get Authors associated with an Publication
export async function getAuthors(
    {
        publication,
        page,
        pageSize,
    }: GetAuthorsOptions,
): Promise<ApiResponse<GraphQLAuthor[]>> {
    const constraints = [];
    if (publication) {
        const publicationConstraint = intermineConstraint('Author.publications.id', '=', publication.id);
        constraints.push(publicationConstraint);
    }
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
