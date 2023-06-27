import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';


// <class name="GeneticMarker" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0001645">
// 	<attribute name="genotypingPlatform" type="java.lang.String"/>
// 	<attribute name="motif" type="java.lang.String"/>
// 	<attribute name="alias" type="java.lang.String"/>
// 	<attribute name="type" type="java.lang.String"/>
// 	<attribute name="alleles" type="java.lang.String"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="markers"/>
// 	<collection name="gwasResults" referenced-type="GWASResult" reverse-reference="markers"/>
// 	<collection name="linkageGroupPositions" referenced-type="LinkageGroupPosition"/>
// </class>
export const intermineGeneticMarkerAttributes = [
    'GeneticMarker.id',
    'GeneticMarker.primaryIdentifier',
    'GeneticMarker.description',
    'GeneticMarker.symbol',
    'GeneticMarker.name',
    'GeneticMarker.assemblyVersion',
    'GeneticMarker.annotationVersion',
    'GeneticMarker.organism.taxonId',
    'GeneticMarker.strain.identifier',
    'GeneticMarker.length',
    'GeneticMarker.genotypingPlatform',
    'GeneticMarker.motif',
    'GeneticMarker.alias',
    'GeneticMarker.type',
    'GeneticMarker.alleles',
];
export const intermineGeneticMarkerSort = 'GeneticMarker.primaryIdentifier';
export type IntermineGeneticMarker = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
  string,
  string,
];


// type GeneticMarker implements SequenceFeature {
//   id: ID!
//   identifier: String!
//   # ontologyAnnotations
//   # publications
//   description: String
//   symbol: String
//   name: String
//   assemblyVersion: String
//   annotationVersion: String
//   organism: Organism
//   strain: Strain
//   # locations
//   # synonyms
//   # crossReferences
//   # dataSets
//   # locatedFeatures
//   # score
//   # scoreType
//   length: Int
//   # sequenceOntologyTerm
//   # supercontigLocation
//   # chromosomeLocation
//   # supercontig
//   # sequence
//   # chromosome
//   # overlappingFeatures
//   # childFeatures
//   genotypingPlatform: String
//   motif: String
//   alias: String
//   type: String
//   alleles: String
//   qtls: [QTL]
//   gwasResults: [GWASResult]
//   linkageGroupPositions: [LinkageGroupPosition]
// }
export const graphqlGeneticMarkerAttributes = [
    'id',
    'identifier',
    'description',
    'symbol',
    'name',
    'assemblyVersion',
    'annotationVersion',
    'organismTaxonId',
    'strainIdentifier',
    'length',
    'genotypingPlatform',
    'motif',
    'alias',
    'type',
    'alleles',
];
export type GraphQLGeneticMarker = {
  [prop in typeof graphqlGeneticMarkerAttributes[number]]: string;
}


export type IntermineGeneticMarkerResponse = IntermineDataResponse<IntermineGeneticMarker>;
export function response2geneticMarkers(response: IntermineGeneticMarkerResponse): Array<GraphQLGeneticMarker> {
    return response2graphqlObjects(response, graphqlGeneticMarkerAttributes);
}
