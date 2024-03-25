import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

// Annotatable
// 	<attribute name="primaryIdentifier" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000673"/>
// BioEntity
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="symbol" type="java.lang.String" term="http://www.w3.org/2004/02/skos/core//prefLabel"/>
// 	<attribute name="name" type="java.lang.String" term="http://www.w3.org/2000/01/rdf-schema//label"/>
// 	<attribute name="assemblyVersion" type="java.lang.String"/>
// 	<attribute name="annotationVersion" type="java.lang.String"/>
// 	<attribute name="secondaryIdentifier" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000673"/>
// 	<reference name="organism" referenced-type="Organism" term="http://purl.org/net/orth//organism"/>
// 	<reference name="strain" referenced-type="Strain" term="http://semanticscience.org/resource/SIO_010055"/>
// SequenceFeature
// 	<attribute name="score" type="java.lang.Double" term="http://edamontology.org/data_1772"/>
// 	<attribute name="scoreType" type="java.lang.String" term="http://purl.org/dc/terms/type"/>
// 	<attribute name="length" type="java.lang.Integer" term="http://purl.org/dc/terms/SizeOrDuration"/>
// 	<reference name="sequenceOntologyTerm" referenced-type="SOTerm"/>
// 	<reference name="supercontigLocation" referenced-type="Location"/>
// 	<reference name="chromosomeLocation" referenced-type="Location"/>
// 	<reference name="supercontig" referenced-type="Supercontig"/>
// 	<reference name="sequence" referenced-type="Sequence"/>
// 	<reference name="chromosome" referenced-type="Chromosome" term="http://purl.org/dc/terms/isPartOf"/>
// Gene
// 	<attribute name="briefDescription" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000136"/>
// 	<attribute name="ensemblName" type="java.lang.String"/>
// 	<reference name="upstreamIntergenicRegion" referenced-type="IntergenicRegion" term="http://purl.obolibrary.org/obo/SO_0000605"/>
// 	<reference name="downstreamIntergenicRegion" referenced-type="IntergenicRegion" term="http://purl.obolibrary.org/obo/SO_0000605"/>
export const intermineGeneAttributes = [
    ...intermineSequenceFeatureAttributesFactory('Gene'),
    'Gene.briefDescription',
    'Gene.ensemblName',
    'Gene.upstreamIntergenicRegion.primaryIdentifier', // reference resolution
    'Gene.downstreamIntergenicRegion.primaryIdentifier', // reference resolution
];
export const intermineGeneSort = 'Gene.primaryIdentifier'; // guaranteed not null
export type IntermineGene = [
    ...IntermineSequenceFeature,
    string,
    string,
    string,
    string
];

// 'Gene.id',
// // Annotatable
// 'Gene.primaryIdentifier',
// // BioEntity
// 'Gene.description',
// 'Gene.symbol',
// 'Gene.name',
// 'Gene.assemblyVersion',
// 'Gene.annotationVersion',
// 'Gene.secondaryIdentifier',
// 'Gene.organism.taxonId',   // reference resolution
// 'Gene.strain.identifier',  // reference resolution
// // SequenceFeature
// 'Gene.score',
// 'Gene.scoreType',
// 'Gene.length',
// 'Gene.sequenceOntologyTerm.identifier', // reference resolution
// 'Gene.chromosomeLocation.id',   // reference resolution
// 'Gene.supercontigLocation.id',  // reference resolution
// 'Gene.sequence.id', // reference resolution
// 'Gene.chromosome.primaryIdentifier', // reference resolution
// 'Gene.supercontig.primaryIdentifier', // reference resolution
// // Gene
// 'Gene.briefDescription',
// 'Gene.ensemblName',
// 'Gene.upstreamIntergenicRegion.primaryIdentifier', // reference resolution
// 'Gene.downstreamIntergenicRegion.primaryIdentifier', // reference resolution
export const graphqlGeneAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'briefDescription',
    'ensemblName',
    'upstreamIntergenicRegionIdentifier', // reference resolution
    'downstreamIntergenicRegionIdentifier' // reference resolution
];
export type GraphQLGene = {
    [prop in typeof graphqlGeneAttributes[number]]: string;
}


export type IntermineGeneResponse = IntermineDataResponse<IntermineGene>;
// converts an Intermine response into an array of GraphQL Gene objects
export function response2genes(response: IntermineGeneResponse): Array<GraphQLGene> {
    return response2graphqlObjects(response, graphqlGeneAttributes);
}
