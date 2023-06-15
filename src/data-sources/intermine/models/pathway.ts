import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';


// <class name="Pathway" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="name" type="java.lang.String"/>
// 	<attribute name="stableIdentifier" type="java.lang.String"/>
// 	<collection name="genes" referenced-type="Gene" reverse-reference="pathways"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const interminePathwayAttributes = [
    'Pathway.id',
    'Pathway.primaryIdentifier',
    'Pathway.name',
    'Pathway.stableIdentifier',
];
export const interminePathwaySort = 'Pathway.primaryIdentifier';
export type InterminePathway = [
  number,
  string,
  string,
  string,
];


// type Pathway implements Annotatable {
//   id: ID!
//   identifier: String!
//   ontologyAnnotations: [OntologyAnnotation]
//   publications: [Publication]
//   name: String
//   stableIdentifier: String
//   genes: [Gene]
//   dataSets: [DataSet]
// }
export const graphqlPathwayAttributes = [
    'id',
    'identifier',
    'name',
    'stableIdentifier',
];
export type GraphQLPathway = {
  [prop in typeof graphqlPathwayAttributes[number]]: string;
}


export type InterminePathwayResponse = IntermineDataResponse<InterminePathway>;
// converts an Intermine response into an array of GraphQL Pathway objects
export function response2pathways(response: InterminePathwayResponse): Array<GraphQLPathway> {
    return response2graphqlObjects(response, graphqlPathwayAttributes);
}


// Pathway.dataSets has no reverse reference
export const interminePathwayDataSetAttributes = [
    'Pathway.dataSets.id',
    'Pathway.dataSets.description',
    'Pathway.dataSets.licence',
    'Pathway.dataSets.url',
    'Pathway.dataSets.name',
    'Pathway.dataSets.version',
    'Pathway.dataSets.synopsis',
    'Pathway.dataSets.publication.id',  // internal resolution of publication
];
export const interminePathwayDataSetSort = 'Pathway.dataSets.name'; // guaranteed not null
export type InterminePathwayDataSet = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
];
