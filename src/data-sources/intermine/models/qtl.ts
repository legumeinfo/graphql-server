import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="QTL" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0001645">
// 	<attribute name="identifier" type="java.lang.String"/>
// 	<attribute name="lod" type="java.lang.Double"/>
// 	<attribute name="likelihoodRatio" type="java.lang.Double"/>
// 	<attribute name="end" type="java.lang.Double"/>
// 	<attribute name="markerNames" type="java.lang.String"/>
// 	<attribute name="markerR2" type="java.lang.Double"/>
// 	<attribute name="start" type="java.lang.Double"/>
// 	<attribute name="peak" type="java.lang.Double"/>
// 	<reference name="trait" referenced-type="Trait" reverse-reference="qtls"/>
// 	<reference name="qtlStudy" referenced-type="QTLStudy" reverse-reference="qtls"/>
// 	<reference name="linkageGroup" referenced-type="LinkageGroup" reverse-reference="qtls"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="genes" referenced-type="Gene"/>
// 	<collection name="markers" referenced-type="GeneticMarker" reverse-reference="qtls"/>
// </class>
export const intermineQTLAttributes = [
    'QTL.id',
    'QTL.identifier',
    'QTL.end',
    'QTL.markerNames',
    'QTL.start',
    'QTL.trait.primaryIdentifier',
    'QTL.qtlStudy.primaryIdentifier',
    'QTL.linkageGroup.id',
    'QTL.dataSet.name',
];
export const intermineQTLSort = 'QTL.trait.name ASC QTL.identifier ASC';
export type IntermineQTL = [
  number,
  string,
  number,
  string,
  number,
  string,
  string,
  number,
  string,
];


// type QTL {
//   id: ID!
//   identifier: String!
//   # lod: Float
//   # likelihoodRatio: Float
//   end: Float
//   markerNames: String
//   # markerR2
//   start: Float
//   # peak
//   trait: Trait
//   qtlStudy: QTLStudy
//   linkageGroup
//   dataSet: DataSet
//   # genes: [Gene]
//   # markers: [GeneticMarker]
// }
export const graphqlQTLAttributes = [
    'id',
    'identifier',
    'end',
    'markerNames',
    'start',
    'traitIdentifier',
    'qtlStudyIdentifier',
    'linkageGroupId',
    'dataSetName',
];
export type GraphQLQTL = {
  [prop in typeof graphqlQTLAttributes[number]]: string;
}


export type IntermineQTLResponse = Response<IntermineQTL>;
export function response2qtls(response: IntermineQTLResponse): Array<GraphQLQTL> {
    return response2graphqlObjects(response, graphqlQTLAttributes);
}
