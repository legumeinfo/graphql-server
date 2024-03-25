import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';


// <class name="QTL" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0001645">
// 	<attribute name="primaryIdentifier" type="java.lang.String"/>
//      <attribute name="name" type="java.lang.String"/>
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
    ...intermineAnnotatableAttributesFactory('QTL'),
    'QTL.name',
    'QTL.lod',
    'QTL.likelihoodRatio',
    'QTL.end',
    'QTL.markerNames',
    'QTL.markerR2',
    'QTL.start',
    'QTL.peak',
    'QTL.trait.primaryIdentifier',
    'QTL.qtlStudy.primaryIdentifier',
    'QTL.linkageGroup.primaryIdentifier',
    'QTL.dataSet.name',
];
export const intermineQTLSort = 'QTL.trait.name ASC QTL.primaryIdentifier ASC';
export type IntermineQTL = [
    ...IntermineAnnotatable,
    string,
    number,
    number,
    number,
    string,
    number,
    number,
    number,
    string,
    string,
    string,
    string,
];


// type QTL {
//   id: ID!
//   identifier: String!
//   name: String
//   lod: Float
//   likelihoodRatio: Float
//   end: Float
//   markerNames: String
//   markerR2
//   start: Float
//   peak: Float
//   trait: Trait
//   qtlStudy: QTLStudy
//   linkageGroup
//   dataSet: DataSet
//   # genes: [Gene]
//   markers: [GeneticMarker]
// }
export const graphqlQTLAttributes = [
    ...graphqlAnnotatableAttributes,
    'name',
    'lod',
    'likelihoodRatio',
    'end',
    'markerNames',
    'markerR2',
    'start',
    'peak',
    'traitIdentifier',
    'qtlStudyIdentifier',
    'linkageGroupIdentifier',
    'dataSetName',
];
export type GraphQLQTL = {
    [prop in typeof graphqlQTLAttributes[number]]: string;
}


export type IntermineQTLResponse = IntermineDataResponse<IntermineQTL>;
export function response2qtls(response: IntermineQTLResponse): Array<GraphQLQTL> {
    return response2graphqlObjects(response, graphqlQTLAttributes);
}
