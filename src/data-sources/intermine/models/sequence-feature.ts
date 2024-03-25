import { GraphQLChromosome } from './chromosome.js';
import { GraphQLGene } from './gene.js';
import { GraphQLGeneticMarker } from './genetic-marker.js';
import { GraphQLMRNA } from './mrna.js';
import { GraphQLSyntenicRegion } from './syntenic-region.js';
import { GraphQLSupercontig } from './supercontig.js';
import { graphqlBioEntityAttributes } from './bio-entity.js';


export type GraphQLSequenceFeature =
  GraphQLChromosome |
  GraphQLGene |
  GraphQLGeneticMarker |
  GraphQLMRNA |  // should actually be transcript; mRNA extends transcript
  GraphQLSyntenicRegion |
  GraphQLSupercontig;


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
