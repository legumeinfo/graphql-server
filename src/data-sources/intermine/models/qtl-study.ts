import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';


// <class name="QTLStudy" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="genotypes" type="java.lang.String"/>
// 	<attribute name="synopsis" type="java.lang.String"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="qtlStudy"/>
// </class>
export const intermineQTLStudyAttributes = [
    ...intermineAnnotatableAttributesFactory('QTLStudy'),
    'QTLStudy.description',
    'QTLStudy.genotypes',
    'QTLStudy.synopsis',
    'QTLStudy.organism.taxonId',
    'QTLStudy.dataSet.name',
];
export const intermineQTLStudySort = 'QTLStudy.primaryIdentifier';
export type IntermineQTLStudy = [
  ...IntermineAnnotatable,
  string,
  string,
  string,
  number,
  string,
];


// type QTLStudy {
//   id: ID!
//   identifier: String!
//   # ontologyAnnotations
//   # publications
//   description: String
//   genotypes: String
//   synopsis: String
//   organism: Organism
//   dataSet: DataSet
//   qtls: [QTL]
// }
export const graphqlQTLStudyAttributes = [
    ...graphqlAnnotatableAttributes,
    'description',
    'genotypes',
    'synopsis',
    'organismTaxonId',
    'dataSetName',
];
export type GraphQLQTLStudy = {
  [prop in typeof graphqlQTLStudyAttributes[number]]: string;
}


export type IntermineQTLStudyResponse = IntermineDataResponse<IntermineQTLStudy>;
export function response2qtlStudies(response: IntermineQTLStudyResponse): Array<GraphQLQTLStudy> {
    return response2graphqlObjects(response, graphqlQTLStudyAttributes);
}
