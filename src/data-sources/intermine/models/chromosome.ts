// Chromosome extends SequenceFeature with no additional attributes, references, or collections
export const intermineChromosomeAttributes = [
    'Chromosome.id',
    'Chromosome.primaryIdentifier',               // Annotatable
    'Chromosome.description',                     // BioEntity
    'Chromosome.symbol',                          // BioEntity
    'Chromosome.name',                            // BioEntity
    'Chromosome.assemblyVersion',                 // BioEntity
    'Chromosome.annotationVersion',               // BioEntity
    'Chromosome.secondaryIdentifier',             // BioEntity
    'Chromosome.organism.taxonId',                // BioEntity - reference resolution
    'Chromosome.strain.identifier',               // BioEntity - reference resolution
    'Chromosome.score',                           // SequenceFeature
    'Chromosome.scoreType',                       // SequenceFeature
    'Chromosome.length',                          // SequenceFeature
    'Chromosome.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'Chromosome.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'Chromosome.supercontigLocation.id',          // SequenceFeature - reference resolution
    'Chromosome.sequence.id',                     // SequenceFeature - reference resolution
    'Chromosome.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'Chromosome.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
];

export const intermineChromosomeSort = 'Chromosome.primaryIdentifier'; // guaranteed not null

// use IntermineSequenceFeature
// use graphqlSequenceFeatureAttributes
// use GraphQLSequenceFeature
// use IntermineSequenceFeatureResponse
// use response2sequenceFeature
