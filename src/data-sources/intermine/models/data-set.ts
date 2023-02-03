// <class name="DataSet" is-interface="true" term="http://semanticscience.org/resource/SIO_000089">
// 	<attribute name="description" type="java.lang.String" term="http://purl.org/dc/terms/description"/>
// 	<attribute name="licence" type="java.lang.String" term="http://purl.org/dc/terms/license"/>
// 	<attribute name="url" type="java.lang.String" term="https://schema.org/url"/>
// 	<attribute name="name" type="java.lang.String" term="http://www.w3.org/2000/01/rdf-schema#label"/>
// 	<attribute name="version" type="java.lang.String" term="http://purl.org/dc/terms/hasVersion"/>
// 	<attribute name="synopsis" type="java.lang.String"/>
// 	<reference name="dataSource" referenced-type="DataSource" reverse-reference="dataSets" term="http://purl.org/dc/terms/source"/>
// 	<reference name="publication" referenced-type="Publication" term="http://purl.org/dc/terms/bibliographicCitation"/>
// 	<collection name="bioEntities" referenced-type="BioEntity" reverse-reference="dataSets" term="http://semanticscience.org/resource/SIO_001277"/>
// </class>
export const intermineDataSetAttributes = [
    'DataSet.id',
    'DataSet.description',
    'DataSet.licence',
    'DataSet.url',
    'DataSet.name',
    'DataSet.version',
    'DataSet.synopsis',
    'DataSet.publication.id',  // internal resolution of publication
];
export const intermineDataSetSort = 'DataSet.name'; // guaranteed not null


// type DataSet {
//   id: ID!
//   description: String
//   licence: String
//   url: String
//   name: String
//   version: String
//   synopsis: String
//   # dataSource
//   publication: Publication
//   # bioEntities
// }
export const graphqlDataSetAttributes = [
    'id',
    'description',
    'licence',
    'url',
    'name',
    'version',
    'synopsis',
    'publicationId',
];


// converts an Intermine response into an array of GraphQL DataSet objects
export function response2dataSets(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlDataSetAttributes);
}
