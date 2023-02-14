import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLAuthor,
  IntermineAuthorResponse,
  intermineAuthorAttributes,
  intermineAuthorSort,
  response2authors,
} from '../models/index.js';


// get a author by ID
export async function getAuthor(id: number): Promise<GraphQLAuthor> {
    const constraints = [intermineConstraint('Author.id', '=', id)];
    const query = interminePathQuery(
        intermineAuthorAttributes,
        intermineAuthorSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineAuthorResponse) => response2authors(response))
        .then((authors: Array<GraphQLAuthor>) => {
            if (!authors.length) {
                const msg = `Author with ID '${id}' not found`;
                this.inputError(msg);
            }
            return authors[0];
        });
}
