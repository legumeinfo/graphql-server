import {
    IntermineDataResponse,
    IntermineQueryFormat,
    objectsResponse2response,
    response2graphqlObjects,
} from '../intermine.server.js';
import {
    IntermineSequenceFeature,
    IntermineSequenceFeatureObject,
    graphqlSequenceFeatureAttributes,
    intermineSequenceFeatureAttributesFactory,
    intermineSequenceFeatureObjectAttributesFactory,
} from './sequence-feature.js';
import { GraphQLMRNA } from './mrna.js';


export type GraphQLTranscript =
    GraphQLMRNA;

export const intermineTranscriptQueryFormat = IntermineQueryFormat.JSON_OBJECTS;

export const intermineTranscriptAttributesFactory = (type = 'Transcript') => [
    ...intermineSequenceFeatureAttributesFactory(type),
    `${type}.gene.primaryIdentifier`,
    `${type}.protein.primaryIdentifier`,
];
export const intermineTranscriptAttributes = intermineTranscriptAttributesFactory();

export const intermineTranscriptSortFactory = (type = 'Transcript') => `${type}.primaryIdentifier`;
export const intermineTranscriptSort = intermineTranscriptSortFactory();

export type IntermineTranscriptObject = {
    gene: {class: string, primaryIdentifier: string},
    protein: {class: string, primaryIdentifier: number},
} & IntermineSequenceFeatureObject;

export const intermineTranscriptObjectAttributesFactory = (type = 'Transcript') => [
    ...intermineSequenceFeatureObjectAttributesFactory(type),,
    `${type}.gene.primaryIdentifier`,
    `${type}.protein.primaryIdentifier`,
];

export const intermineTranscriptObjectAttributes = intermineTranscriptObjectAttributesFactory();

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

export type IntermineTranscriptResponse = IntermineDataResponse<IntermineSequenceFeatureObject>;
// converts an Intermine jsonobjects response into an array of GraphQL SequenceFeature objects
export function response2transcripts(response: IntermineTranscriptResponse): Array<GraphQLTranscript> {
    const jsonResponse = objectsResponse2response(response, intermineTranscriptObjectAttributes);
    return response2graphqlObjects(jsonResponse, graphqlTranscriptAttributes);
}
