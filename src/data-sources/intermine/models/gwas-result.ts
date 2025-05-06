import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const intermineGWASResultAttributes = [
  ...intermineAnnotatableAttributesFactory('GWASResult'),
  'GWASResult.markerName',
  'GWASResult.pValue',
  'GWASResult.gwas.primaryIdentifier',
  'GWASResult.trait.primaryIdentifier',
  'GWASResult.dataSet.name',
];
export const intermineGWASResultSort = 'GWASResult.markerName';
export type IntermineGWASResult = [
  ...IntermineAnnotatable,
  string,
  number,
  string,
  string,
  string,
];

export const graphqlGWASResultAttributes = [
  ...graphqlAnnotatableAttributes,
  'markerName',
  'pValue',
  'gwasIdentifier',
  'traitIdentifier',
  'dataSetName',
];
export type GraphQLGWASResult = {
  [prop in (typeof graphqlGWASResultAttributes)[number]]: string;
};

export type IntermineGWASResultResponse =
  IntermineDataResponse<IntermineGWASResult>;
export function response2gwasResults(
  response: IntermineGWASResultResponse,
): Array<GraphQLGWASResult> {
  return response2graphqlObjects(response, graphqlGWASResultAttributes);
}
