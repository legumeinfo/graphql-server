import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    IntermineAnnotatable,
    graphqlAnnotatableAttributes,
    intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const interminePanGeneSetAttributes = [
    ...intermineAnnotatableAttributesFactory('PanGeneSet'),
];
export const interminePanGeneSetSort = 'PanGeneSet.primaryIdentifier';
export type InterminePanGeneSet = [
    ...IntermineAnnotatable,
];

export const graphqlPanGeneSetAttributes = [
    ...graphqlAnnotatableAttributes,
];
export type GraphQLPanGeneSet = {
    [prop in typeof graphqlPanGeneSetAttributes[number]]: string;
}

export type InterminePanGeneSetResponse = IntermineDataResponse<InterminePanGeneSet>;
export function response2panGeneSets(response: InterminePanGeneSetResponse): Array<GraphQLPanGeneSet> {
    return response2graphqlObjects(response, graphqlPanGeneSetAttributes);
}
