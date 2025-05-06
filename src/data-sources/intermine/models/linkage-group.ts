import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const intermineLinkageGroupAttributes = [
  ...intermineAnnotatableAttributesFactory('LinkageGroup'),
  'LinkageGroup.name',
  'LinkageGroup.length',
  'LinkageGroup.number',
  'LinkageGroup.geneticMap.primaryIdentifier',
];
export const intermineLinkageGroupSort = 'LinkageGroup.primaryIdentifier';
export type IntermineLinkageGroup = [
  ...IntermineAnnotatable,
  string,
  number,
  number,
  string,
];

export const graphqlLinkageGroupAttributes = [
  ...graphqlAnnotatableAttributes,
  'name',
  'length',
  'number',
  'geneticMapIdentifier',
];
export type GraphQLLinkageGroup = {
  [prop in (typeof graphqlLinkageGroupAttributes)[number]]: string;
};

export type IntermineLinkageGroupResponse =
  IntermineDataResponse<IntermineLinkageGroup>;
export function response2linkageGroups(
  response: IntermineLinkageGroupResponse,
): Array<GraphQLLinkageGroup> {
  return response2graphqlObjects(response, graphqlLinkageGroupAttributes);
}
