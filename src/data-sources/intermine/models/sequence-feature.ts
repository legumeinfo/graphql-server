import { GraphQLGene } from './gene.js';
import { GraphQLGeneticMarker } from './genetic-marker.js';
import { GraphQLMRNA } from './mrna.js';
import { GraphQLSyntenicRegion } from './syntenic-region.js';


export type GraphQLSequenceFeature =
  GraphQLGene |
  GraphQLGeneticMarker |
  GraphQLMRNA |
  GraphQLSyntenicRegion;
