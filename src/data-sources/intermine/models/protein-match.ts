import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineBioEntity,
  graphqlBioEntityAttributes,
  intermineBioEntityAttributesFactory,
} from './bio-entity.js';

export const intermineProteinMatchAttributes = [
    ...intermineBioEntityAttributesFactory('ProteinMatch'),
    'ProteinMatch.source',
    'ProteinMatch.signatureDesc',
    'ProteinMatch.status',
    'ProteinMatch.length',
    'ProteinMatch.target',
    'ProteinMatch.date',
    'ProteinMatch.accession',
    'ProteinMatch.protein.primaryIdentifier',
];

export const intermineProteinMatchSort = 'ProteinMatch.primaryIdentifier';

export type IntermineProteinMatch = [
    ...IntermineBioEntity,
    string,
    string,
    string,
    number,
    string,
    string,
    string,
    string,
];

export const graphqlProteinMatchAttributes = [
    ...graphqlBioEntityAttributes,
    'source',
    'signatureDesc',
    'status',
    'length',
    'target',
    'date',
    'accession',
    'proteinIdentifier',
];

export type GraphQLProteinMatch = {
    [prop in typeof graphqlProteinMatchAttributes[number]]: string;
}

export type IntermineProteinMatchResponse = IntermineDataResponse<IntermineProteinMatch>;

export function response2proteinMatches(response: IntermineProteinMatchResponse): Array<GraphQLProteinMatch> {
    return response2graphqlObjects(response, graphqlProteinMatchAttributes);
}
