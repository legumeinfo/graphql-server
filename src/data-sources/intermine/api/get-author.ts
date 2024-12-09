import {
    ApiResponse,
    intermineConstraint,
    interminePathQuery,
} from '../intermine.server.js';
import {
    GraphQLAuthor,
    IntermineAuthorResponse,
    intermineAuthorAttributes,
    intermineAuthorSort,
    response2authors,
} from '../models/index.js';


// get a author by ID
export async function getAuthor(firstName: string, lastName: string): Promise<ApiResponse<GraphQLAuthor>> {
    const constraints = [
        intermineConstraint('Author.firstName', '=', firstName),
        intermineConstraint('Author.lastName', '=', lastName),
    ];
    const query = interminePathQuery(
        intermineAuthorAttributes,
        intermineAuthorSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineAuthorResponse) => response2authors(response))
        .then((authors: Array<GraphQLAuthor>) => {
            if (!authors.length) return null;
            return authors[0];
        })
        .then((author: GraphQLAuthor) => ({data: author}));
}
