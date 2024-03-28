import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    intermineJoin,
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

// get Publications using the given query and returns the expected GraphQL types
async function getPublications(pathQuery: string, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLPublication>> {
    // get the data
    const dataPromise = this.pathQuery(pathQuery, {page, pageSize})
        .then((response: InterminePublicationResponse) => response2publications(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(pathQuery, {summaryPath: 'Publication.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get Publications associated with an Annotatable
export async function getPublicationsForAnnotatable(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLPublication>> {
    const constraints = [intermineConstraint('Publication.entities.id', '=', id)];
    const query = interminePathQuery(
        interminePublicationAttributes,
        interminePublicationSort,
        constraints,
    );
    // get the data
    return getPublications(query, {page, pageSize});
}

// get Publications associated with an Author
export async function getPublicationsForAuthor(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLPublication>> {
    const constraints = [intermineConstraint('Publication.authors.id', '=', id)];
    const query = interminePathQuery(
        interminePublicationAttributes,
        interminePublicationSort,
        constraints,
    );
    // get the data
    return getPublications(query, {page, pageSize});
}

// get Publications associated with a DataSource
export async function getPublicationsForDataSource(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLPublication>> {
    const constraints = [intermineConstraint('DataSource.id', '=', id)];
    const joins = [intermineJoin('DataSource.publication', 'OUTER')];
    const query = interminePathQuery(
        interminePublicationAttributes,
        interminePublicationSort,
        constraints,
        joins,
    );
    // get the data
    return getPublications(query, {page, pageSize});
}
