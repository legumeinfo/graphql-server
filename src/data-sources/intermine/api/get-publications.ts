import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
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
): Promise<GraphQLPublication[]> {
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
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: InterminePublicationResponse) => response2publications(response));
}
