import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    IntermineSequenceFeature,
    graphqlSequenceFeatureAttributes,
    intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

export const intermineExonAttributes = [
    ...intermineSequenceFeatureAttributesFactory('Exon'),
];
export const intermineExonSort = 'Exon.primaryIdentifier';

export type IntermineExon = [
    ...IntermineSequenceFeature,
];

export const graphqlExonAttributes = [
    ...graphqlSequenceFeatureAttributes,
];

export type GraphQLExon = {
    [prop in typeof graphqlExonAttributes[number]]: string;
}

export type IntermineExonResponse = IntermineDataResponse<IntermineExon>;

// converts an Intermine response into an array of GraphQL Exon objects
export function response2exons(response: IntermineExonResponse): Array<GraphQLExon> {
    return response2graphqlObjects(response, graphqlExonAttributes);
}
