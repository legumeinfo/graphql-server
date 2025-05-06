import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  intermineGeneAttributesFactory,
  intermineGeneSortFactory,
} from './gene.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

export const intermineIntergenicRegionAttributes = [
  ...intermineSequenceFeatureAttributesFactory('IntergenicRegion'),
];
export const intermineIntergenicRegionSort =
  'IntergenicRegion.primaryIdentifier';

export type IntermineIntergenicRegion = [...IntermineSequenceFeature];

export const graphqlIntergenicRegionAttributes = [
  ...graphqlSequenceFeatureAttributes,
];

export type GraphQLIntergenicRegion = {
  [prop in (typeof graphqlIntergenicRegionAttributes)[number]]: string;
};

export type IntermineIntergenicRegionResponse =
  IntermineDataResponse<IntermineIntergenicRegion>;

// converts an Intermine response into an array of GraphQL IntergenicRegion objects
export function response2intergenicRegions(
  response: IntermineIntergenicRegionResponse,
): Array<GraphQLIntergenicRegion> {
  return response2graphqlObjects(response, graphqlIntergenicRegionAttributes);
}

// IntergenicRegion.adjacentGenes are Genes
export const intermineIntergenicRegionAdjacentGeneAttributes =
  intermineGeneAttributesFactory('IntergenicRegion.adjacentGenes');
export const intermineIntergenicRegionAdjacentGeneSort =
  intermineGeneSortFactory('IntergenicRegion.adjacentGenes');
