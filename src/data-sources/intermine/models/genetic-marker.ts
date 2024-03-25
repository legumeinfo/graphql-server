import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';


// <class name="GeneticMarker" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0001645">
// 	<attribute name="motif" type="java.lang.String"/>
// 	<attribute name="alias" type="java.lang.String"/>
// 	<attribute name="type" type="java.lang.String"/>
// 	<attribute name="alleles" type="java.lang.String"/>
// 	<collection name="genotypingPlatforms" referenced-type="GenotypingPlatform" reverse-reference="markers"/>
// 	<collection name="gwasResults" referenced-type="GWASResult" reverse-reference="markers"/>
// 	<collection name="linkageGroupPositions" referenced-type="LinkageGroupPosition"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="markers"/>
// </class>
export const intermineGeneticMarkerAttributes = [
    ...intermineSequenceFeatureAttributesFactory('GeneticMarker'),
    'GeneticMarker.motif',
    'GeneticMarker.alias',
    'GeneticMarker.type',
    'GeneticMarker.alleles',
];
export const intermineGeneticMarkerSort = 'GeneticMarker.primaryIdentifier';
export type IntermineGeneticMarker = [
  ...IntermineSequenceFeature,
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
//   motif: String
//   alias: String
//   type: String
//   alleles: String
//   qtls: [QTL]
//   gwasResults: [GWASResult]
//   linkageGroupPositions: [LinkageGroupPosition]
// }
export const graphqlGeneticMarkerAttributes = [
    ...graphqlSequenceFeatureAttributes,
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
