import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const interminePhylotreeAttributes = [
  ...intermineAnnotatableAttributesFactory('Phylotree'),
  'Phylotree.numLeaves',
  'Phylotree.geneFamily.primaryIdentifier',
];
export const interminePhylotreeSort = 'Phylotree.primaryIdentifier';
export type InterminePhylotree = [...IntermineAnnotatable, number, string];

export const graphqlPhylotreeAttributes = [
  ...graphqlAnnotatableAttributes,
  'numLeaves',
  'geneFamilyIdentifier',
];
export type GraphQLPhylotree = {
  [prop in (typeof graphqlPhylotreeAttributes)[number]]: string;
};

export type InterminePhylotreeResponse =
  IntermineDataResponse<InterminePhylotree>;
export function response2phylotrees(
  response: InterminePhylotreeResponse,
): Array<GraphQLPhylotree> {
  return response2graphqlObjects(response, graphqlPhylotreeAttributes);
}
