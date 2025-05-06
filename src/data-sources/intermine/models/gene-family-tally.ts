import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';

export const intermineGeneFamilyTallyAttributes = [
  'GeneFamilyTally.id',
  'GeneFamilyTally.averageCount',
  'GeneFamilyTally.totalCount',
  'GeneFamilyTally.numAnnotations',
  'GeneFamilyTally.organism.taxonId',
  'GeneFamilyTally.geneFamily.primaryIdentifier',
];
export const intermineGeneFamilyTallySort = 'GeneFamilyTally.id';

export type IntermineGeneFamilyTally = [
  number,
  number,
  number,
  number,
  number,
  string,
];

export const graphqlGeneFamilyTallyAttributes = [
  'id',
  'averageCount',
  'totalCount',
  'numAnnotations',
  'organismTaxonId',
  'geneFamilyIdentifier',
];

export type GraphQLGeneFamilyTally = {
  [prop in (typeof graphqlGeneFamilyTallyAttributes)[number]]: string;
};

export type IntermineGeneFamilyTallyResponse =
  IntermineDataResponse<IntermineGeneFamilyTally>;

export function response2geneFamilyTallies(
  response: IntermineGeneFamilyTallyResponse,
): Array<GraphQLGeneFamilyTally> {
  return response2graphqlObjects(response, graphqlGeneFamilyTallyAttributes);
}
