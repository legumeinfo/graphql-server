import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="Annotatable" is-interface="true">
// 	<attribute name="primaryIdentifier" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000673"/>
// 	<collection name="ontologyAnnotations" referenced-type="OntologyAnnotation" reverse-reference="subject" term="http://semanticscience.org/resource/SIO_000255"/>
// 	<collection name="publications" referenced-type="Publication" reverse-reference="entities" term="http://purl.org/dc/terms/bibliographicCitation"/>
//      <collection name="dataSets" referenced-type="DataSet" reverse-reference="entities" term="http://semanticscience.org/resource/SIO_001278"/>
// </class>
export const intermineAnnotatableAttributes = [
    'Annotatable.id',
    'Annotatable.primaryIdentifier',  // Annotatable
];
export const intermineAnnotatableSort = 'Annotatable.primaryIdentifier';

// this may be used for any type that extends Annotatable without additional attributes or references
export type IntermineAnnotatable = [
    number, // id
    string, // primaryIdentifier
];

// this may be used for any type that extends Annotatable without additional attributes or references
export const graphqlAnnotatableAttributes = [
    'id',         // id
    'identifier', // primaryIdentifier
];

// this may be used for any type that extends Annotatable without additional attributes or references
export type GraphQLAnnotatable = {
    [prop in typeof graphqlAnnotatableAttributes[number]]: string;
}
    
// this may be used for any type that extends Annotatable without additional attributes or references
export type IntermineAnnotatableResponse = IntermineDataResponse<IntermineAnnotatable>;

// converts an Intermine response into an array of GraphQL Annotatable objects
// this may be used for any type that extends Annotatable without additional attributes or references
export function response2annotatables(response: IntermineAnnotatableResponse): Array<GraphQLAnnotatable> {
    return response2graphqlObjects(response, graphqlAnnotatableAttributes);
}
