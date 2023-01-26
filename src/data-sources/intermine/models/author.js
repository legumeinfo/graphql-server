// <class name="Author" is-interface="true" term="http://purl.obolibrary.org/obo/NCIT_C42781">
// 	<attribute name="firstName" type="java.lang.String" term="http://xmlns.com/foaf/0.1/givenname"/>
// 	<attribute name="initials" type="java.lang.String"/>
// 	<attribute name="lastName" type="java.lang.String" term="http://xmlns.com/foaf/0.1/family_name"/>
// 	<attribute name="name" type="java.lang.String" term="http://xmlns.com/foaf/0.1/name"/>
// 	<collection name="publications" referenced-type="Publication" reverse-reference="authors"/>
// </class>
const intermineAuthorAttributes = [
    'Author.id',
    'Author.firstName',
    'Author.initials',
    'Author.lastName',
    'Author.name',
];
const intermineAuthorSort = 'Author.lastName'; // guaranteed not null

// type Author {
//   id: ID!
//   firstName: String
//   initials: String
//   lastName: String
//   name: String
//   publications: [Publication]
// }
const graphqlAuthorAttributes = [
    'id',
    'firstName',
    'initials',
    'lastName',
    'name',
];

// converts an Intermine response into an array of GraphQL Author objects
function response2authors(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlAuthorAttributes);
}


module.exports = {
    intermineAuthorAttributes,
    intermineAuthorSort,
    graphqlAuthorAttributes,
    response2authors,
}
