import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLAuthor,
  GraphQLPublication,
  IntermineAuthorResponse,
  intermineAuthorAttributes,
  intermineAuthorSort,
  response2authors,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type GetAuthorsOptions = {
  publication?: GraphQLPublication;
} & PaginationOptions;


// get Authors associated with an Publication
export async function getAuthors(
  {
    publication,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: GetAuthorsOptions,
): Promise<GraphQLAuthor[]> {
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
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineAuthorResponse) => response2authors(response));
}
