import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
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
        page,
        pageSize,
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
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: InterminePublicationResponse) => response2publications(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
