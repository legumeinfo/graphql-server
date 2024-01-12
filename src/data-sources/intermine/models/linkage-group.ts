import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="LinkageGroup" extends="Annotatable" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000018">
// 	<attribute name="name" type="java.lang.String"/>
// 	<attribute name="length" type="java.lang.Double"/>
// 	<attribute name="number" type="java.lang.Integer"/>
// 	<reference name="geneticMap" referenced-type="GeneticMap" reverse-reference="linkageGroups"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="linkageGroup"/>
// </class>
export const intermineLinkageGroupAttributes = [
    'LinkageGroup.id',                // Annotatable
    'LinkageGroup.primaryIdentifier', // Annotatable
    'LinkageGroup.name',
    'LinkageGroup.length',
    'LinkageGroup.number',
    'LinkageGroup.geneticMap.primaryIdentifier', // resolve reference
];
export const intermineLinkageGroupSort = 'LinkageGroup.primaryIdentifier';

export type IntermineLinkageGroup = [
    number, // id
    string, // primaryIdentifier
    string, // name
    number, // length
    number, // number
    string, // geneticMap.primaryIdentifier
];

export const graphqlLinkageGroupAttributes = [
    'id',         // id
    'identifier', // primaryIdentifier
    'name',       // name
    'length',     // length
    'number',     // number
    'geneticMapIdentifier', // resolve GeneticMap
];

export type GraphQLLinkageGroup = {
    [prop in typeof graphqlLinkageGroupAttributes[number]]: string;
}

export type IntermineLinkageGroupResponse = IntermineDataResponse<IntermineLinkageGroup>;

export function response2linkageGroups(response: IntermineLinkageGroupResponse): Array<GraphQLLinkageGroup> {
    return response2graphqlObjects(response, graphqlLinkageGroupAttributes);
}
