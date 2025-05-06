import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';
import {
  intermineGeneAttributesFactory,
  intermineGeneSortFactory,
} from './gene.js';

export const intermineQTLAttributes = [
  ...intermineAnnotatableAttributesFactory('QTL'),
  'QTL.name',
  'QTL.lod',
  'QTL.likelihoodRatio',
  'QTL.end',
  'QTL.markerR2',
  'QTL.start',
  'QTL.peak',
  'QTL.trait.primaryIdentifier',
  'QTL.qtlStudy.primaryIdentifier',
  'QTL.linkageGroup.primaryIdentifier',
  'QTL.dataSets.name',
];
export const intermineQTLSort = 'QTL.trait.name ASC QTL.primaryIdentifier ASC';
export type IntermineQTL = [
  ...IntermineAnnotatable,
  string,
  number,
  number,
  number,
  number,
  number,
  number,
  string,
  string,
  string,
  string,
];

export const graphqlQTLAttributes = [
  ...graphqlAnnotatableAttributes,
  'name',
  'lod',
  'likelihoodRatio',
  'end',
  'markerR2',
  'start',
  'peak',
  'traitIdentifier',
  'qtlStudyIdentifier',
  'linkageGroupIdentifier',
  'dataSetName',
];
export type GraphQLQTL = {
  [prop in (typeof graphqlQTLAttributes)[number]]: string;
};

export type IntermineQTLResponse = IntermineDataResponse<IntermineQTL>;
export function response2qtls(
  response: IntermineQTLResponse,
): Array<GraphQLQTL> {
  return response2graphqlObjects(response, graphqlQTLAttributes);
}

// QTL.genes does not have a reverse reference from Gene
export const intermineQTLGenesAttributes =
  intermineGeneAttributesFactory('QTL.genes');
export const intermineQTLGenesSort = intermineGeneSortFactory('QTL.genes');
