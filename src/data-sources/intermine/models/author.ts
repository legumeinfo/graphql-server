import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="Author" is-interface="true" term="http://purl.obolibrary.org/obo/NCIT_C42781">
// 	<attribute name="firstName" type="java.lang.String" term="http://xmlns.com/foaf/0.1/givenname"/>
// 	<attribute name="initials" type="java.lang.String"/>
// 	<attribute name="lastName" type="java.lang.String" term="http://xmlns.com/foaf/0.1/family_name"/>
// 	<attribute name="name" type="java.lang.String" term="http://xmlns.com/foaf/0.1/name"/>
// 	<collection name="publications" referenced-type="Publication" reverse-reference="authors"/>
// </class>
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


// type Author {
//   id: ID!
//   firstName: String
//   initials: String
//   lastName: String
//   name: String
//   publications: [Publication]
// }
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


export type IntermineAuthorResponse = Response<IntermineAuthor>;
// converts an Intermine response into an array of GraphQL Author objects
export function response2authors(response: IntermineAuthorResponse): Array<GraphQLAuthor> {
    return response2graphqlObjects(response, graphqlAuthorAttributes);
}
