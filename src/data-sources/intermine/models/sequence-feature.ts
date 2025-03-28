import {
    IntermineDataResponse,
    IntermineQueryFormat,
    objectsResponse2response,
    response2graphqlObjects,
} from '../intermine.server.js';
import {
    IntermineBioEntity,
    IntermineBioEntityObject,
    graphqlBioEntityAttributes,
    intermineBioEntityAttributesFactory,
    intermineBioEntityObjectAttributesFactory,
} from './bio-entity.js';
import { GraphQLChromosome } from './chromosome.js';
import { GraphQLExon } from './exon.js';
import { GraphQLGene } from './gene.js';
import { GraphQLGeneFlankingRegion } from './gene-flanking-region.js';
import { GraphQLGeneticMarker } from './genetic-marker.js';
import { GraphQLIntergenicRegion } from './intergenic-region.js';
import { GraphQLIntron } from './intron.js';
import { GraphQLSupercontig } from './supercontig.js';
import { GraphQLSyntenicRegion } from './syntenic-region.js';
import { GraphQLTranscript } from './transcript.js';
import { GraphQLUTR } from './utr.js';


export type GraphQLSequenceFeature =
    GraphQLTranscript |
    GraphQLChromosome |
    GraphQLExon |
    GraphQLGene |
    GraphQLGeneFlankingRegion |
    GraphQLGeneticMarker |
    GraphQLIntergenicRegion |
    GraphQLIntron |
    GraphQLSupercontig |
    GraphQLSyntenicRegion |
    GraphQLUTR;


export const intermineSequenceFeatureQueryFormat = IntermineQueryFormat.JSON_OBJECTS;

export const intermineSequenceFeatureAttributesFactory = (type = 'SequenceFeature') => [
    ...intermineBioEntityAttributesFactory(type),
    `${type}.score`,
    `${type}.scoreType`,
    `${type}.length`,
    `${type}.sequenceOntologyTerm.identifier`,
    `${type}.chromosomeLocation.id`,
    `${type}.supercontigLocation.id`,
    `${type}.sequence.id`,
    `${type}.chromosome.primaryIdentifier`,
    `${type}.supercontig.primaryIdentifier`,
];

export const intermineSequenceFeatureSortFactory = (type = 'SequenceFeature') => `${type}.primaryIdentifier`;

export const intermineSequenceFeatureAttributes = intermineSequenceFeatureAttributesFactory();

export const intermineSequenceFeatureSort = intermineSequenceFeatureSortFactory();

export const intermineOverlappingFeatureAttributes = intermineSequenceFeatureAttributesFactory('SequenceFeature.overlapping');

export const intermineOverlappingFeatureSort = intermineSequenceFeatureSortFactory('SequenceFeature.overlapping');

export const intermineSequenceFeatureChildFeatureAttributes = intermineSequenceFeatureAttributesFactory('SequenceFeature.childFeatures');

export const intermineSequenceFeatureChildFeatureSort = intermineSequenceFeatureSortFactory('SequenceFeature.childFeatures');

export type IntermineSequenceFeatureObject = {
    score: number,
    scoreType: string,
    length: number,
    sequenceOntologyTerm: {class: string, primaryIdentifier: string},
    chromosomeLocation: {class: string, objectId: number},
    supercontigLocation: {class: string, objectId: number},
    sequence: {class: string, objectId: number},
    chromosome: {class: string, primaryIdentifier: string},
    supercontig: {class: string, primaryIdentifier: string},
} & IntermineBioEntityObject;

export const intermineSequenceFeatureObjectAttributesFactory = (type = 'SequenceFeature') => [
    ...intermineBioEntityObjectAttributesFactory(type),
    `${type}.score`,
    `${type}.scoreType`,
    `${type}.length`,
    `${type}.sequenceOntologyTerm.primaryIdentifier`,
    `${type}.chromosomeLocation.objectId`,
    `${type}.supercontigLocation.objectId`,
    `${type}.sequence.objectId`,
    `${type}.chromosome.primaryIdentifier`,
    `${type}.supercontig.primaryIdentifier`,
];

export const intermineSequenceFeatureObjectAttributes = intermineSequenceFeatureObjectAttributesFactory();

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

export type IntermineSequenceFeatureResponse = IntermineDataResponse<IntermineSequenceFeatureObject>;
// converts an Intermine jsonobjects response into an array of GraphQL SequenceFeature objects
export function response2sequenceFeatures(response: IntermineSequenceFeatureResponse): Array<GraphQLSequenceFeature> {
    const jsonResponse = objectsResponse2response(response, intermineSequenceFeatureObjectAttributes);
    return response2graphqlObjects(jsonResponse, graphqlSequenceFeatureAttributes);
}
