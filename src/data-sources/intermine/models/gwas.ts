import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';

// <class name="GWAS" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="genotypes" type="java.lang.String"/>
// 	<attribute name="genotypingMethod" type="java.lang.String"/>
// 	<attribute name="synopsis" type="java.lang.String"/>
// 	<attribute name="genotypingPlatform" type="java.lang.String"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="results" referenced-type="GWASResult" reverse-reference="gwas"/>
// </class>
export const intermineGWASAttributes = [
    ...intermineAnnotatableAttributesFactory('GWAS'),
    'GWAS.description',
    'GWAS.genotypes',
    'GWAS.genotypingMethod',
    'GWAS.synopsis',
    'GWAS.genotypingPlatform.primaryIdentifier',
    'GWAS.organism.taxonId',
    'GWAS.dataSet.name',
];
export const intermineGWASSort = 'GWAS.primaryIdentifier';
//export type IntermineGWAS = {
//  [prop in typeof intermineGWASAttributes[number]]: string;
//}
export type IntermineGWAS = [
  ...IntermineAnnotatable,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
];

// type GWAS implements Annotatable {
//   # Annotatable
//   id: ID!
//   identifier: ID!
//   ontologyAnnotations: [OntologyAnnotation!]!
//   publications: [Publication!]!
//   # GWAS
//   description: String
//   genotypes: String
//   genotypingMethod: String
//   synopsis: String
//   genotypingPlatform: GenotypingPlatform
//   organism: Organism
//   dataSet: DataSet
//   results: [GWASResult!]!
// }
export const graphqlGWASAttributes = [
    ...graphqlAnnotatableAttributes,
    'description',
    'genotypes',
    'genotypingMethod',
    'synopsis',
    'genotypingPlatformIdentifier',
    'organismTaxonId',
    'dataSetName',
];
export type GraphQLGWAS = {
  [prop in typeof graphqlGWASAttributes[number]]: string;
}


export type IntermineGWASResponse = IntermineDataResponse<IntermineGWAS>;
export function response2gwas(response: IntermineGWASResponse): Array<GraphQLGWAS> {
    return response2graphqlObjects(response, graphqlGWASAttributes);
}
