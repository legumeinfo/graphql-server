// SequenceFeature.overlappingFeatures extend SequenceFeature with no additional attributes, references, or collections
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
