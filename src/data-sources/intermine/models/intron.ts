import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    intermineGeneAttributesFactory,
    intermineGeneSortFactory,
} from './gene.js';
import {
    IntermineSequenceFeature,
    graphqlSequenceFeatureAttributes,
    intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

export const intermineIntronAttributes = [
    ...intermineSequenceFeatureAttributesFactory('Intron'),
];
export const intermineIntronSort = 'Intron.primaryIdentifier';

export type IntermineIntron = [
    ...IntermineSequenceFeature,
];

export const graphqlIntronAttributes = [
    ...graphqlSequenceFeatureAttributes,
];

export type GraphQLIntron = {
    [prop in typeof graphqlIntronAttributes[number]]: string;
}

export type IntermineIntronResponse = IntermineDataResponse<IntermineIntron>;

// converts an Intermine response into an array of GraphQL Intron objects
export function response2introns(response: IntermineIntronResponse): Array<GraphQLIntron> {
    return response2graphqlObjects(response, graphqlIntronAttributes);
}

// IntergenicRegion.adjacentGenes are Genes
export const intermineIntronGeneAttributes = intermineGeneAttributesFactory('Intron.genes');
export const intermineIntronGeneSort = intermineGeneSortFactory('Intron.genes');
