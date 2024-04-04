import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

export const intermineAuthorAttributes = [
    'Author.id',
    'Author.firstName',
    'Author.initials',
    'Author.lastName',
    'Author.name',
];
export const intermineAuthorSort = 'Author.lastName'; // guaranteed not null
export type IntermineAuthor = [
  number,
  string,
  string,
  string,
  string,
];

export const graphqlAuthorAttributes = [
    'id',
    'firstName',
    'initials',
    'lastName',
    'name',
];
export type GraphQLAuthor = {
  [prop in typeof graphqlAuthorAttributes[number]]: string;
}


export type IntermineAuthorResponse = IntermineDataResponse<IntermineAuthor>;
// converts an Intermine response into an array of GraphQL Author objects
export function response2authors(response: IntermineAuthorResponse): Array<GraphQLAuthor> {
    return response2graphqlObjects(response, graphqlAuthorAttributes);
}
