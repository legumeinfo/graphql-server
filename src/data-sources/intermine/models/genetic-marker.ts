import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import { IntermineSequenceFeature, graphqlSequenceFeatureAttributes } from './sequence-feature.js';

// <class name="GeneticMarker" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0001645">
// 	<attribute name="motif" type="java.lang.String"/>
// 	<attribute name="alias" type="java.lang.String"/>
// 	<attribute name="type" type="java.lang.String"/>
// 	<attribute name="alleles" type="java.lang.String"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="markers"/>
// 	<collection name="genotypingPlatforms" referenced-type="GenotypingPlatform" reverse-reference="markers"/>
// 	<collection name="gwasResults" referenced-type="GWASResult" reverse-reference="markers"/>
// 	<collection name="linkageGroupPositions" referenced-type="LinkageGroupPosition"/>
// </class>
export const intermineGeneticMarkerAttributes = [
    'GeneticMarker.id',
    'GeneticMarker.primaryIdentifier',               // Annotatable
    'GeneticMarker.description',                     // BioEntity
    'GeneticMarker.symbol',                          // BioEntity
    'GeneticMarker.name',                            // BioEntity
    'GeneticMarker.assemblyVersion',                 // BioEntity
    'GeneticMarker.annotationVersion',               // BioEntity
    'GeneticMarker.secondaryIdentifier',             // BioEntity
    'GeneticMarker.organism.taxonId',                // BioEntity - reference resolution
    'GeneticMarker.strain.identifier',               // BioEntity - reference resolution
    'GeneticMarker.score',                           // SequenceFeature
    'GeneticMarker.scoreType',                       // SequenceFeature
    'GeneticMarker.length',                          // SequenceFeature
    'GeneticMarker.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'GeneticMarker.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'GeneticMarker.supercontigLocation.id',          // SequenceFeature - reference resolution
    'GeneticMarker.sequence.id',                     // SequenceFeature - reference resolution
    'GeneticMarker.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'GeneticMarker.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
    'GeneticMarker.motif',
    'GeneticMarker.alias',
    'GeneticMarker.type',
    'GeneticMarker.alleles',
];
export const intermineGeneticMarkerSort = 'GeneticMarker.primaryIdentifier';
export type IntermineGeneticMarker = [
    ...IntermineSequenceFeature,
    string, // motif
    string, // alias
    string, // type
    string, // alleles
];

export const graphqlGeneticMarkerAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'motif',   // motif
    'alias',   // alias
    'type',    // type
    'alleles', // alleles
];

export type GraphQLGeneticMarker = {
  [prop in typeof graphqlGeneticMarkerAttributes[number]]: string;
}

export type IntermineGeneticMarkerResponse = IntermineDataResponse<IntermineGeneticMarker>;

export function response2geneticMarkers(response: IntermineGeneticMarkerResponse): Array<GraphQLGeneticMarker> {
    return response2graphqlObjects(response, graphqlGeneticMarkerAttributes);
}
