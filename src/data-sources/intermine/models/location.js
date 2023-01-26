// <class name="Location" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0000735">
// 	<attribute name="strand" type="java.lang.String" term="http://purl.obolibrary.org/obo/GENO_0000906"/>
// 	<attribute name="start" type="java.lang.Integer" term="http://purl.obolibrary.org/obo/RO_0002231"/>
// 	<attribute name="end" type="java.lang.Integer" term="http://purl.obolibrary.org/obo/RO_0002232"/>
// 	<reference name="locatedOn" referenced-type="BioEntity" reverse-reference="locatedFeatures"/>
// 	<reference name="feature" referenced-type="BioEntity" reverse-reference="locations"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
const intermineLocationAttributes = [
    'Location.id',
    'Location.strand',
    'Location.start',
    'Location.end',
    'Location.locatedOn.id',
];
const intermineLocationSort = 'Location.start'; // guaranteed not null

// type Location {
//   id: ID!
//   strand: String
//   start: Int
//   end: Int
//   # locatedOn
//   # feature
//   # dataSets
// }
const graphqlLocationAttributes = [
    'id',
    'strand',
    'start',
    'end',
    'chromosomeId',
];

// converts an Intermine response into an array of GraphQL Location objects
function response2locations(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlLocationAttributes);
}


module.exports = {
    intermineLocationAttributes,
    intermineLocationSort,
    graphqlLocationAttributes,
    response2locations,
}
