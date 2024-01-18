import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="DataSource" is-interface="true" term="http://purl.obolibrary.org/obo/NCIT_C25683">
// 	<attribute name="description" type="java.lang.String" term="http://purl.org/dc/terms/description"/>
// 	<attribute name="url" type="java.lang.String" term="http://edamontology.org/data_1052"/>
// 	<attribute name="name" type="java.lang.String" term="http://www.w3.org/2000/01/rdf-schema#label"/>
// 	<collection name="publications" referenced-type="Publication" term="http://purl.org/dc/terms/bibliographicCitation"/>
// 	<collection name="dataSets" referenced-type="DataSet" reverse-reference="dataSource"/>
// </class>
export const intermineDataSourceAttributes = [
    'DataSource.id',
    'DataSource.description',
    'DataSource.url',
    'DataSource.name',
];
export const intermineDataSourceSort = 'DataSource.name';

export type IntermineDataSource = [
    number, // id
    string, // description
    string, // url
    string, // name
];

export const graphqlDataSourceAttributes = [
    'id',             // id
    'description',    // description
    'url',            // url
    'name',           // name
];

export type GraphQLDataSource = {
    [prop in typeof graphqlDataSourceAttributes[number]]: string;
}

export type IntermineDataSourceResponse = IntermineDataResponse<IntermineDataSource>;

// converts an Intermine response into an array of GraphQL DataSource objects
export function response2dataSources(response: IntermineDataSourceResponse): Array<GraphQLDataSource> {
    return response2graphqlObjects(response, graphqlDataSourceAttributes);
}
