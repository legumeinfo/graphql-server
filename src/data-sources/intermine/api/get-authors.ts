import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo
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
        start,
        size,
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
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineAuthorResponse) => response2authors(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Author.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
