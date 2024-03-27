import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';


// <class name="LinkageGroup" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000018">
// 	<attribute name="primaryIdentifier" type="java.lang.String"/>
//      <attribute name="name" type="java.lang.String"/>
// 	<attribute name="length" type="java.lang.Double"/>
// 	<attribute name="number" type="java.lang.Integer"/>
// 	<reference name="geneticMap" referenced-type="GeneticMap" reverse-reference="linkageGroups"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="linkageGroup"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const intermineLinkageGroupAttributes = [
    ...intermineAnnotatableAttributesFactory('LinkageGroup'),
    'LinkageGroup.name',
    'LinkageGroup.length',
    'LinkageGroup.number',
    'LinkageGroup.geneticMap.primaryIdentifier',
];
export const intermineLinkageGroupSort = 'LinkageGroup.primaryIdentifier';
export type IntermineLinkageGroup = [
    ...IntermineAnnotatable,
    string,
    number,
    number,
    string,
];


// type LinkageGroup {
//   id: ID!
//   identifier: String!
//   name: String
//   length: Float
//   number: Int
//   geneticMap: GeneticMap
//   qtls: [QTL]
//   # dataSets
// }
export const graphqlLinkageGroupAttributes = [
    ...graphqlAnnotatableAttributes,
    'name',
    'length',
    'number',
    'geneticMapIdentifier',
];
export type GraphQLLinkageGroup = {
    [prop in typeof graphqlLinkageGroupAttributes[number]]: string;
}


export type IntermineLinkageGroupResponse = IntermineDataResponse<IntermineLinkageGroup>;
export function response2linkageGroups(response: IntermineLinkageGroupResponse): Array<GraphQLLinkageGroup> {
    return response2graphqlObjects(response, graphqlLinkageGroupAttributes);
}
