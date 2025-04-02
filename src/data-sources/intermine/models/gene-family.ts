import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    IntermineAnnotatable,
    graphqlAnnotatableAttributes,
    intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const intermineGeneFamilyAttributes = [
    ...intermineAnnotatableAttributesFactory('GeneFamily'),
    'GeneFamily.description',
    'GeneFamily.version',
    'GeneFamily.size',
    'GeneFamily.phylotree.primaryIdentifier',
];
export const intermineGeneFamilySort = 'GeneFamily.primaryIdentifier';
export type IntermineGeneFamily = [
    ...IntermineAnnotatable,
    string,
    string,
    number,
    string,
];

export const graphqlGeneFamilyAttributes = [
    ...graphqlAnnotatableAttributes,
    'description',
    'version',
    'size',
    'phylotreeIdentifier',
];
export type GraphQLGeneFamily = {
    [prop in typeof graphqlGeneFamilyAttributes[number]]: string;
}

export type IntermineGeneFamilyResponse = IntermineDataResponse<IntermineGeneFamily>;
export function response2geneFamilies(response: IntermineGeneFamilyResponse): Array<GraphQLGeneFamily> {
    return response2graphqlObjects(response, graphqlGeneFamilyAttributes);
}
