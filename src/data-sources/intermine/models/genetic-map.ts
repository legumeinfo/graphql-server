import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="GeneticMap" extends="Annotatable" is-interface="true" term="http://purl.bioontology.org/ontology/EDAM?conceptid=http%3A%2F%2Fedamontology.org%2Fdata_1278">
// 	<attribute name="genotypingPlatform" type="java.lang.String"/>
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="genotypes" type="java.lang.String"/>
// 	<attribute name="genotypingMethod" type="java.lang.String"/>
// 	<attribute name="synopsis" type="java.lang.String"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<collection name="linkageGroups" referenced-type="LinkageGroup" reverse-reference="geneticMap"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const intermineGeneticMapAttributes = [
    'GeneticMap.id',
    'GeneticMap.primaryIdentifier',
    'GeneticMap.genotypingPlatform',
    'GeneticMap.description',
    'GeneticMap.genotypes',
    'GeneticMap.genotypingMethod',
    'GeneticMap.synopsis',
    'GeneticMap.organism.id',
];
export const intermineGeneticMapSort = 'GeneticMap.primaryIdentifier';
export type IntermineGeneticMap = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
];


// type GeneticMap {
//   id: ID!
//   identifier: String!
//   # ontologyAnnotations
//   # publications
//   genotypingPlatform: String
//   description: String
//   genotypes: String
//   genotypingMethod: String
//   synopsis: String
//   organism: Organism
//   linkageGroups: [LinkageGroup]
//   # dataSets
// }
export const graphqlGeneticMapAttributes = [
    'id',
    'identifier',
    'genotypingPlatform',
    'description',
    'genotypes',
    'genotypingMethod',
    'synopsis',
    'organismId',
];
export type GraphQLGeneticMap = {
  [prop in typeof graphqlGeneticMapAttributes[number]]: string;
}


export type IntermineGeneticMapResponse = Response<IntermineGeneticMap>;
export function response2geneticMaps(response: IntermineGeneticMapResponse): Array<GraphQLGeneticMap> {
    return response2graphqlObjects(response, graphqlGeneticMapAttributes);
}

// GeneticMap.dataSets has no reverse reference
export const intermineGeneticMapDataSetAttributes = [
    'GeneticMap.dataSets.id',
    'GeneticMap.dataSets.description',
    'GeneticMap.dataSets.licence',
    'GeneticMap.dataSets.url',
    'GeneticMap.dataSets.name',
    'GeneticMap.dataSets.version',
    'GeneticMap.dataSets.synopsis',
    'GeneticMap.dataSets.publication.id',  // internal resolution of publication
];
export const intermineGeneticMapDataSetSort = 'GeneticMap.dataSets.name'; // guaranteed not null
export type IntermineGeneticMapDataSet = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
];
