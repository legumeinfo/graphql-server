import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';

export const intermineSequenceAttributes = [
  'Sequence.id',
  'Sequence.md5checksum',
  'Sequence.residues',
  'Sequence.length',
];
export const intermineSequenceSort = 'Sequence.length';

export type IntermineSequence = [number, string, string, number];

export const graphqlSequenceAttributes = [
  'id',
  'md5checksum',
  'residues',
  'length',
];

export type GraphQLSequence = {
  [prop in (typeof graphqlSequenceAttributes)[number]]: string;
};

export type IntermineSequenceResponse =
  IntermineDataResponse<IntermineSequence>;

// converts an Intermine response into an array of GraphQL Sequence objects
export function response2sequences(
  response: IntermineSequenceResponse,
): Array<GraphQLSequence> {
  return response2graphqlObjects(response, graphqlSequenceAttributes);
}
