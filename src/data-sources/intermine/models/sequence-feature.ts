import { GraphQLChromosome } from './chromosome.js';
import { GraphQLGene } from './gene.js';
import { GraphQLGeneticMarker } from './genetic-marker.js';
import { GraphQLMRNA } from './mrna.js';
import { GraphQLSyntenicRegion } from './syntenic-region.js';
import { GraphQLSupercontig } from './supercontig.js';


export type GraphQLSequenceFeature =
  GraphQLChromosome |
  GraphQLGene |
  GraphQLGeneticMarker |
  GraphQLMRNA |  // should actually be transcript; mRNA extends transcript
  GraphQLSyntenicRegion |
  GraphQLSupercontig;
