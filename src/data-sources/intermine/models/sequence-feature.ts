import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  IntermineBioEntity,
  graphqlBioEntityAttributes,
  intermineBioEntityAttributesFactory,
} from './bio-entity.js';
//import { GraphQLChromosome } from './chromosome.js';
//import { GraphQLExon } from './exon.js';
//import { GraphQLGene } from './gene.js';
//import { GraphQLGeneFlankingRegion } from './gene-flanking-region.js';
//import { GraphQLGeneticMarker } from './genetic-marker.js';
//import { GraphQLIntergenicRegion } from './intergenic-region.js';
//import { GraphQLIntron } from './intron.js';
//import { GraphQLSupercontig } from './supercontig.js';
//import { GraphQLSyntenicRegion } from './syntenic-region.js';
//import { GraphQLTranscript } from './transcript.js';
//import { GraphQLUTR } from './utr.js';


//export type GraphQLSequenceFeature =
//  GraphQLTranscript |
//  GraphQLChromosome |
//  GraphQLExon |
//  GraphQLGene |
//  GraphQLGeneFlankingRegion |
//  GraphQLGeneticMarker |
//  GraphQLIntergenicRegion |
//  GraphQLIntron |
//  GraphQLSupercontig |
//  GraphQLSyntenicRegion |
//  GraphQLUTR;


export const intermineSequenceFeatureAttributesFactory = (type = 'SequenceFeature') => [
    ...intermineBioEntityAttributesFactory(type),
    'SequenceFeature.score',
    'SequenceFeature.scoreType',
    'SequenceFeature.length',
    'SequenceFeature.sequenceOntologyTerm.identifier',
    'SequenceFeature.chromosomeLocation.id',
    'SequenceFeature.supercontigLocation.id',
    'SequenceFeature.sequence.id',
    'SequenceFeature.chromosome.primaryIdentifier',
    'SequenceFeature.supercontig.primaryIdentifier',
];

export const intermineSequenceFeatureSortFactory = (type = 'SequenceFeature') => `${type}.primaryIdentifier`;

export const intermineSequenceFeatureAttributes = intermineSequenceFeatureAttributesFactory();

export const intermineSequenceFeatureSort = intermineSequenceFeatureSortFactory();

export const intermineOverlappingFeatureAttributes = intermineSequenceFeatureAttributesFactory('SequenceFeature.overlapping');

export const intermineOverlappingFeatureSort = intermineSequenceFeatureSortFactory('SequenceFeature.overlapping');

export const intermineSequenceFeatureChildFeatureAttributes = intermineSequenceFeatureAttributesFactory('SequenceFeature.childFeatures');

export const intermineSequenceFeatureChildFeatureSort = intermineSequenceFeatureSortFactory('SequenceFeature.childFeatures');


// this may be used for any type that extends SequenceFeature without additional attributes or references
export type IntermineSequenceFeature = [
    ...IntermineBioEntity,
    number,
    string,
    number,
    string,
    number,
    number,
    number,
    string,
    string,
];

// this may be used for any type that extends SequenceFeature without additional attributes or references
export const graphqlSequenceFeatureAttributes = [
    ...graphqlBioEntityAttributes,
    'score',
    'scoreType',
    'length',
    'soTermIdentifier',
    'chromosomeLocationId',
    'supercontigLocationId',
    'sequenceId',
    'chromosomeIdentifier',
    'supercontigIdentifier',
];

// this may be used for any type that extends SequenceFeature without additional attributes or references
export type GraphQLSequenceFeature = {
    [prop in typeof graphqlSequenceFeatureAttributes[number]]: string;
}

// this may be used for any type that extends SequenceFeature without additional attributes or references
export type IntermineSequenceFeatureResponse = IntermineDataResponse<IntermineSequenceFeature>;

// converts an Intermine response into an array of GraphQL SequenceFeature objects
// this may be used for any type that extends SequenceFeature without additional attributes or references
export function response2sequenceFeatures(response: IntermineSequenceFeatureResponse): Array<GraphQLSequenceFeature> {
    return response2graphqlObjects(response, graphqlSequenceFeatureAttributes);
}
