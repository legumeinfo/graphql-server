import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import { graphqlBioEntityAttributes } from './index.js';

export const intermineSequenceFeatureAttributes = [
    'SequenceFeature.id',
    'SequenceFeature.primaryIdentifier',               // Annotatable
    'SequenceFeature.description',                     // BioEntity
    'SequenceFeature.symbol',                          // BioEntity
    'SequenceFeature.name',                            // BioEntity
    'SequenceFeature.assemblyVersion',                 // BioEntity
    'SequenceFeature.annotationVersion',               // BioEntity
    'SequenceFeature.secondaryIdentifier',             // BioEntity
    'SequenceFeature.organism.taxonId',                // BioEntity - reference resolution
    'SequenceFeature.strain.identifier',               // BioEntity - reference resolution
    'SequenceFeature.score',                           // SequenceFeature
    'SequenceFeature.scoreType',                       // SequenceFeature
    'SequenceFeature.length',                          // SequenceFeature
    'SequenceFeature.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'SequenceFeature.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'SequenceFeature.supercontigLocation.id',          // SequenceFeature - reference resolution
    'SequenceFeature.sequence.id',                     // SequenceFeature - reference resolution
    'SequenceFeature.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'SequenceFeature.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
];
export const intermineSequenceFeatureSort = 'SequenceFeature.primaryIdentifier';

// this may be used for any type that extends SequenceFeature without additional attributes or references
export type IntermineSequenceFeature = [
    number, // id
    string, // primaryIdentifier
    string, // description
    string, // symbol
    string, // name
    string, // assemblyVersion
    string, // annotationVersion
    string, // secondaryIdentifier
    number, // organism.taxonId
    string, // strain.identifier
    number, // score
    string, // scoreType
    number, // length
    string, // sequenceOntologyTerm.identifier
    number, // chromosomeLocation.id
    number, // supercontigLocation.id
    number, // sequence.id
    string, // chromosome.primaryIdentifier
    string, // supercontig.primaryIdentifier
];

// this may be used for any type that extends SequenceFeature without additional attributes or references
export const graphqlSequenceFeatureAttributes = [
    ...graphqlBioEntityAttributes,
    'score',                 // score
    'scoreType',             // scoreType
    'length',                // length
    'soTermIdentifier',      // SOTerm resolution
    'chromosomeLocationId',  // chromosome Location resolution
    'supercontigLocationId', // supercontig Location resolution
    'sequenceId',            // Sequence resolution
    'chromosomeIdentifier',  // Chromosome resolution
    'supercontigIdentifier', // Supercontig resolution
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

// SequenceFeature.overlappingFeatures are SequenceFeatures
export const intermineOverlappingFeatureAttributes = [
    'SequenceFeature.overlappingFeatures.id',
    'SequenceFeature.overlappingFeatures.primaryIdentifier',               // Annotatable
    'SequenceFeature.overlappingFeatures.description',                     // BioEntity
    'SequenceFeature.overlappingFeatures.symbol',                          // BioEntity
    'SequenceFeature.overlappingFeatures.name',                            // BioEntity
    'SequenceFeature.overlappingFeatures.assemblyVersion',                 // BioEntity
    'SequenceFeature.overlappingFeatures.annotationVersion',               // BioEntity
    'SequenceFeature.overlappingFeatures.secondaryIdentifier',             // BioEntity
    'SequenceFeature.overlappingFeatures.organism.taxonId',                // BioEntity - reference resolution
    'SequenceFeature.overlappingFeatures.strain.identifier',               // BioEntity - reference resolution
    'SequenceFeature.overlappingFeatures.score',                           // SequenceFeature
    'SequenceFeature.overlappingFeatures.scoreType',                       // SequenceFeature
    'SequenceFeature.overlappingFeatures.length',                          // SequenceFeature
    'SequenceFeature.overlappingFeatures.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'SequenceFeature.overlappingFeatures.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'SequenceFeature.overlappingFeatures.supercontigLocation.id',          // SequenceFeature - reference resolution
    'SequenceFeature.overlappingFeatures.sequence.id',                     // SequenceFeature - reference resolution
    'SequenceFeature.overlappingFeatures.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'SequenceFeature.overlappingFeatures.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
];
export const intermineOverlappingFeatureSort = 'SequenceFeature.overlappingFeatures.primaryIdentifier';
// use IntermineSequenceFeature
// use graphqlSequenceFeatureAttributes
// use GraphQLSequenceFeature
// use IntermineSequenceFeatureResponse
// use response2sequenceFeature

// SequenceFeature.childFeatures are SequenceFeatures
export const intermineSequenceFeatureChildFeatureAttributes = [
    'SequenceFeature.childFeatures.id',
    'SequenceFeature.childFeatures.primaryIdentifier',               // Annotatable
    'SequenceFeature.childFeatures.description',                     // BioEntity
    'SequenceFeature.childFeatures.symbol',                          // BioEntity
    'SequenceFeature.childFeatures.name',                            // BioEntity
    'SequenceFeature.childFeatures.assemblyVersion',                 // BioEntity
    'SequenceFeature.childFeatures.annotationVersion',               // BioEntity
    'SequenceFeature.childFeatures.secondaryIdentifier',             // BioEntity
    'SequenceFeature.childFeatures.organism.taxonId',                // BioEntity - reference resolution
    'SequenceFeature.childFeatures.strain.identifier',               // BioEntity - reference resolution
    'SequenceFeature.childFeatures.score',                           // SequenceFeature
    'SequenceFeature.childFeatures.scoreType',                       // SequenceFeature
    'SequenceFeature.childFeatures.length',                          // SequenceFeature
    'SequenceFeature.childFeatures.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'SequenceFeature.childFeatures.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'SequenceFeature.childFeatures.supercontigLocation.id',          // SequenceFeature - reference resolution
    'SequenceFeature.childFeatures.sequence.id',                     // SequenceFeature - reference resolution
    'SequenceFeature.childFeatures.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'SequenceFeature.childFeatures.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
];
export const intermineSequenceFeatureChildFeatureSort = 'SequenceFeature.childFeatures.primaryIdentifier';
// use IntermineSequenceFeature
// use graphqlSequenceFeatureAttributes
// use GraphQLSequenceFeature
// use IntermineSequenceFeatureResponse
// use response2sequenceFeatures
