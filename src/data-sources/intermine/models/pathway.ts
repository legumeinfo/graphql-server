import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';


// <class name="Pathway" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="name" type="java.lang.String"/>
// 	<collection name="genes" referenced-type="Gene" reverse-reference="pathways"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const interminePathwayAttributes = [
    ...intermineAnnotatableAttributesFactory('Pathway'),
    'Pathway.name',
];
export const interminePathwaySort = 'Pathway.primaryIdentifier';
export type InterminePathway = [
  ...IntermineAnnotatable,
  string,
];


// type Pathway implements Annotatable {
//   id: ID!
//   identifier: String!
//   ontologyAnnotations: [OntologyAnnotation]
//   publications: [Publication]
//   name: String
//   genes: [Gene]
//   dataSets: [DataSet]
// }
export const graphqlPathwayAttributes = [
    ...graphqlAnnotatableAttributes,
    'name',
];
export type GraphQLPathway = {
  [prop in typeof graphqlPathwayAttributes[number]]: string;
}


export type InterminePathwayResponse = IntermineDataResponse<InterminePathway>;
// converts an Intermine response into an array of GraphQL Pathway objects
export function response2pathways(response: InterminePathwayResponse): Array<GraphQLPathway> {
    return response2graphqlObjects(response, graphqlPathwayAttributes);
}
