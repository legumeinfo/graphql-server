import { GraphQLChromosome } from './chromosome.js';
import { GraphQLGene } from './gene.js';
import { GraphQLGeneticMarker } from './genetic-marker.js';
import { GraphQLMRNA } from './mrna.js';
import { GraphQLProtein } from './protein.js';
import { GraphQLSyntenicRegion } from './syntenic-region.js';


export type GraphQLBioEntity =
  GraphQLChromosome |
  GraphQLGene |
  GraphQLGeneticMarker |
  GraphQLMRNA |
  GraphQLProtein |
  GraphQLSyntenicRegion;
