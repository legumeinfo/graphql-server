import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';

export const intermineNewickAttributes = [
  'Newick.identifier',
  'Newick.contents',
  'Newick.phylotree.primaryIdentifier',
  'Newick.geneFamily.primaryIdentifier',
];
export const intermineNewickSort = 'Newick.identifier';
export type IntermineNewick = [string, string, number, number];

export const graphqlNewickAttributes = [
  'identifier',
  'contents',
  'phylotreeIdentifier',
  'geneFamilyIdentifier',
];
export type GraphQLNewick = {
  [prop in (typeof graphqlNewickAttributes)[number]]: string;
};

export type IntermineNewickResponse = IntermineDataResponse<IntermineNewick>;
export function response2newicks(
  response: IntermineNewickResponse,
): Array<GraphQLNewick> {
  return response2graphqlObjects(response, graphqlNewickAttributes);
}
