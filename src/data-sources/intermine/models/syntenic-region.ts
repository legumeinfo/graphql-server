import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

export const intermineSyntenicRegionAttributes = [
    ...intermineSequenceFeatureAttributesFactory('SyntenicRegion'),
    'SyntenicRegion.syntenyBlock.id',
];
export const intermineSyntenicRegionSort = 'SyntenicRegion.primaryIdentifier';
export type IntermineSyntenicRegion = [
  ...IntermineSequenceFeature,
  number,
];

export const graphqlSyntenicRegionAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'syntenyBlockId',
];
export type GraphQLSyntenicRegion = {
  [prop in typeof graphqlSyntenicRegionAttributes[number]]: string;
}

export type IntermineSyntenicRegionResponse = IntermineDataResponse<IntermineSyntenicRegion>;
// converts an Intermine response into an array of GraphQL SyntenicRegion objects
export function response2syntenicRegions(response: IntermineSyntenicRegionResponse): Array<GraphQLSyntenicRegion> {
    return response2graphqlObjects(response, graphqlSyntenicRegionAttributes);
}
