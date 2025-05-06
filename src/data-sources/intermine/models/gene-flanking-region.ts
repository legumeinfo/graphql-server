import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

export const intermineGeneFlankingRegionAttributes = [
  ...intermineSequenceFeatureAttributesFactory('GeneFlankingRegion'),
  'GeneFlankingRegion.direction',
  'GeneFlankingRegion.distance',
  'GeneFlankingRegion.includeGene',
  'GeneFlankingRegion.gene.primaryIdentifier',
];
export const intermineGeneFlankingRegionSort =
  'GeneFlankingRegion.primaryIdentifier';

export type IntermineGeneFlankingRegion = [
  ...IntermineSequenceFeature,
  string,
  string,
  boolean,
  string,
];

export const graphqlGeneFlankingRegionAttributes = [
  ...graphqlSequenceFeatureAttributes,
  'direction',
  'distance',
  'includeGene',
  'geneIdentifier',
];

export type GraphQLGeneFlankingRegion = {
  [prop in (typeof graphqlGeneFlankingRegionAttributes)[number]]: string;
};

export type IntermineGeneFlankingRegionResponse =
  IntermineDataResponse<IntermineGeneFlankingRegion>;

// converts an Intermine response into an array of GraphQL GeneFlankingRegion objects
export function response2geneFlankingRegions(
  response: IntermineGeneFlankingRegionResponse,
): Array<GraphQLGeneFlankingRegion> {
  return response2graphqlObjects(response, graphqlGeneFlankingRegionAttributes);
}
