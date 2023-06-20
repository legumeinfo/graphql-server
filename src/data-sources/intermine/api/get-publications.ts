import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLAnnotatable,
    GraphQLAuthor,
    GraphQLPublication,
    InterminePublicationResponse,
    interminePublicationAttributes,
    interminePublicationSort,
    response2publications,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetPublicationsOptions = {
    author?: GraphQLAuthor;
    annotatable?: GraphQLAnnotatable;
} & PaginationOptions;


// get Publications associated with an Author or any type that extends Annotatable
export async function getPublications(
    {
        author,
        annotatable,
        start,
        size,
    }: GetPublicationsOptions,
): Promise<ApiResponse<GraphQLPublication[]>> {
    const constraints = [];
    if (author) {
        const constraint = intermineConstraint('Publication.authors.id', '=', author.id);
        constraints.push(constraint);
    }
    if (annotatable) {
        const constraint = intermineConstraint('Publication.entities.id', '=', annotatable.id);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        interminePublicationAttributes,
        interminePublicationSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: InterminePublicationResponse) => response2publications(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Publication.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
