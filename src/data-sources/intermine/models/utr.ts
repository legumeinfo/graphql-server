import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

export const intermineUTRAttributes = [
  ...intermineSequenceFeatureAttributesFactory('UTR'),
];
export const intermineUTRSort = 'UTR.primaryIdentifier';

export type IntermineUTR = [...IntermineSequenceFeature];

export const graphqlUTRAttributes = [...graphqlSequenceFeatureAttributes];

export type GraphQLUTR = {
  [prop in (typeof graphqlUTRAttributes)[number]]: string;
};

export type IntermineUTRResponse = IntermineDataResponse<IntermineUTR>;

// converts an Intermine response into an array of GraphQL UTR objects
export function response2utrs(
  response: IntermineUTRResponse,
): Array<GraphQLUTR> {
  return response2graphqlObjects(response, graphqlUTRAttributes);
}
