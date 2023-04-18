import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
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
        start,
        size,
    }: SearchPublicationsOptions,
): Promise<GraphQLPublication[]> {
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
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: InterminePublicationResponse) => response2publications(response));
}
