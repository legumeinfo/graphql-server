import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

export const intermineGeneticMarkerAttributes = [
    ...intermineSequenceFeatureAttributesFactory('GeneticMarker'),
    'GeneticMarker.motif',
    'GeneticMarker.alias',
    'GeneticMarker.type',
    'GeneticMarker.alleles',
];
export const intermineGeneticMarkerSort = 'GeneticMarker.primaryIdentifier';
export type IntermineGeneticMarker = [
  ...IntermineSequenceFeature,
  string,
  string,
  string,
  string,
];

export const graphqlGeneticMarkerAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'motif',
    'alias',
    'type',
    'alleles',
];
export type GraphQLGeneticMarker = {
  [prop in typeof graphqlGeneticMarkerAttributes[number]]: string;
}

export type IntermineGeneticMarkerResponse = IntermineDataResponse<IntermineGeneticMarker>;
export function response2geneticMarkers(response: IntermineGeneticMarkerResponse): Array<GraphQLGeneticMarker> {
    return response2graphqlObjects(response, graphqlGeneticMarkerAttributes);
}
