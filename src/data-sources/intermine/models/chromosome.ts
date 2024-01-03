// Chromosome extends SequenceFeature with no additional attributes, references, or collections
export const intermineChromosomeAttributes = [
    'Chromosome.id',
    'Chromosome.primaryIdentifier',
    'Chromosome.description',
    'Chromosome.symbol',
    'Chromosome.name',
    'Chromosome.assemblyVersion',
    'Chromosome.annotationVersion',
    'Chromosome.secondaryIdentifier',
    'Chromosome.organism.taxonId',   // reference resolution
    'Chromosome.strain.identifier',  // reference resolution
    'Chromosome.score',
    'Chromosome.scoreType',
    'Chromosome.length',
    'Chromosome.sequenceOntologyTerm.identifier', // reference resolution
    'Chromosome.chromosomeLocation.id',           // reference resolution
    'Chromosome.supercontigLocation.id',          // reference resolution
    'Chromosome.sequence.id',                     // reference resolution
    'Chromosome.chromosome.primaryIdentifier',    // reference resolution
    'Chromosome.supercontig.primaryIdentifier',   // reference resolution
];
export const intermineChromosomeSort = 'Chromosome.primaryIdentifier'; // guaranteed not null

// use IntermineSequenceFeature
// use graphqlSequenceFeatureAttributes
// use GraphQLSequenceFeature
// use IntermineSequenceFeatureResponse
// use response2sequenceFeature
