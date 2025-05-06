import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const intermineGenotypingPlatformAttributes = [
  ...intermineAnnotatableAttributesFactory('GenotypingPlatform'),
];
export const intermineGenotypingPlatformSort =
  'GenotypingPlatform.primaryIdentifier';
export type IntermineGenotypingPlatform = [...IntermineAnnotatable];

export const graphqlGenotypingPlatformAttributes = [
  ...graphqlAnnotatableAttributes,
];
export type GraphQLGenotypingPlatform = {
  [prop in (typeof graphqlGenotypingPlatformAttributes)[number]]: string;
};

export type IntermineGenotypingPlatformResponse =
  IntermineDataResponse<IntermineGenotypingPlatform>;
export function response2genotypingPlatforms(
  response: IntermineGenotypingPlatformResponse,
): Array<GraphQLGenotypingPlatform> {
  return response2graphqlObjects(response, graphqlGenotypingPlatformAttributes);
}
