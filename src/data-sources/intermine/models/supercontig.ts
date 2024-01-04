// Supercontig extends SequenceFeature with no additional attributes, references, or collections
export const intermineSupercontigAttributes = [
    'Supercontig.id',
    'Supercontig.primaryIdentifier',               // Annotatable
    'Supercontig.description',                     // BioEntity
    'Supercontig.symbol',                          // BioEntity
    'Supercontig.name',                            // BioEntity
    'Supercontig.assemblyVersion',                 // BioEntity
    'Supercontig.annotationVersion',               // BioEntity
    'Supercontig.secondaryIdentifier',             // BioEntity
    'Supercontig.organism.taxonId',                // BioEntity - reference resolution
    'Supercontig.strain.identifier',               // BioEntity - reference resolution
    'Supercontig.score',                           // SequenceFeature
    'Supercontig.scoreType',                       // SequenceFeature
    'Supercontig.length',                          // SequenceFeature
    'Supercontig.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'Supercontig.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'Supercontig.supercontigLocation.id',          // SequenceFeature - reference resolution
    'Supercontig.sequence.id',                     // SequenceFeature - reference resolution
    'Supercontig.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'Supercontig.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
];

export const intermineSupercontigSort = 'Supercontig.primaryIdentifier';

// use IntermineSequenceFeature
// use graphqlSequenceFeatureAttributes
// use GraphQLSequenceFeature
// use IntermineSequenceFeatureResponse
// use response2sequenceFeature
