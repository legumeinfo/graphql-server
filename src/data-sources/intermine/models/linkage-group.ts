import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';


// <class name="LinkageGroup" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000018">
// 	<attribute name="identifier" type="java.lang.String"/>
// 	<attribute name="length" type="java.lang.Double"/>
// 	<attribute name="number" type="java.lang.Integer"/>
// 	<reference name="geneticMap" referenced-type="GeneticMap" reverse-reference="linkageGroups"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="linkageGroup"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const intermineLinkageGroupAttributes = [
    'LinkageGroup.id',
    'LinkageGroup.identifier',
    'LinkageGroup.length',
    'LinkageGroup.number',
    'LinkageGroup.geneticMap.primaryIdentifier',
];
export const intermineLinkageGroupSort = 'LinkageGroup.identifier';
export type IntermineLinkageGroup = [
  number,
  string,
  number,
  number,
  string,
];


// type LinkageGroup {
//   id: ID!
//   identifier: String!
//   length: Float
//   number: Int
//   geneticMap: GeneticMap
//   qtls: [QTL]
//   # dataSets
// }
export const graphqlLinkageGroupAttributes = [
    'id',
    'identifier',
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


// LinkageGroup.dataSets has no reverse reference
export const intermineLinkageGroupDataSetAttributes = [
    'LinkageGroup.dataSets.id',
    'LinkageGroup.dataSets.description',
    'LinkageGroup.dataSets.licence',
    'LinkageGroup.dataSets.url',
    'LinkageGroup.dataSets.name',
    'LinkageGroup.dataSets.version',
    'LinkageGroup.dataSets.synopsis',
    'LinkageGroup.dataSets.publication.doi',  // internal resolution of publication
];
export const intermineLinkageGroupDataSetSort = 'LinkageGroup.dataSets.name'; // guaranteed not null
export type IntermineLinkageGroupDataSet = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];
