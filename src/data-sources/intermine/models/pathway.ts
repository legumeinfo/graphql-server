import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const interminePathwayAttributes = [
  ...intermineAnnotatableAttributesFactory('Pathway'),
  'Pathway.name',
];
export const interminePathwaySort = 'Pathway.primaryIdentifier';
export type InterminePathway = [...IntermineAnnotatable, string];

export const graphqlPathwayAttributes = [
  ...graphqlAnnotatableAttributes,
  'name',
];
export type GraphQLPathway = {
  [prop in (typeof graphqlPathwayAttributes)[number]]: string;
};

export type InterminePathwayResponse = IntermineDataResponse<InterminePathway>;
export function response2pathways(
  response: InterminePathwayResponse,
): Array<GraphQLPathway> {
  return response2graphqlObjects(response, graphqlPathwayAttributes);
}
