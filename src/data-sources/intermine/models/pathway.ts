import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="Pathway" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="name" type="java.lang.String"/>
// 	<collection name="genes" referenced-type="Gene" reverse-reference="pathways"/>
// </class>
export const interminePathwayAttributes = [
    'Pathway.id',                // Annotatable
    'Pathway.primaryIdentifier', // Annotatable
    'Pathway.name',
];
export const interminePathwaySort = 'Pathway.primaryIdentifier';

export type InterminePathway = [
  number, // id
  string, // primaryIdentifier
  string, // name
];

export const graphqlPathwayAttributes = [
    'id',         // id
    'identifier', // primaryIdentifier
    'name',       // name
];

export type GraphQLPathway = {
  [prop in typeof graphqlPathwayAttributes[number]]: string;
}

export type InterminePathwayResponse = IntermineDataResponse<InterminePathway>;

// converts an Intermine response into an array of GraphQL Pathway objects
export function response2pathways(response: InterminePathwayResponse): Array<GraphQLPathway> {
    return response2graphqlObjects(response, graphqlPathwayAttributes);
}
