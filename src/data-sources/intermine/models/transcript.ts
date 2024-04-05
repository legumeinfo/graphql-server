import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

export const intermineTranscriptAttributesFactory = (type = 'Transcript') => [
    ...intermineSequenceFeatureAttributesFactory(type),
    `${type}.gene.primaryIdentifier`,
    `${type}.protein.primaryIdentifier`,
];
export const intermineTranscriptAttributes = intermineTranscriptAttributesFactory();

export const intermineTranscriptSortFactory = (type = 'Transcript') => `${type}.primaryIdentifier`;
export const intermineTranscriptSort = intermineTranscriptSortFactory();

export type IntermineTranscript = [
    ...IntermineSequenceFeature,
    string,
    string,
];

export const graphqlTranscriptAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'geneIdentifier',
    'proteinIdentifier',
];

export type GraphQLTranscript = {
    [prop in typeof graphqlTranscriptAttributes[number]]: string;
}

export type IntermineTranscriptResponse = IntermineDataResponse<IntermineTranscript>;

// converts an Intermine response into an array of GraphQL Transcript objects
export function response2transcripts(response: IntermineTranscriptResponse): Array<GraphQLTranscript> {
    return response2graphqlObjects(response, graphqlTranscriptAttributes);
}
