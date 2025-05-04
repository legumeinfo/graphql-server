import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    IntermineAnnotatable,
    graphqlAnnotatableAttributes,
    intermineAnnotatableAttributesFactory,
} from './annotatable.js';
import {
    intermineGeneAttributesFactory,
    intermineGeneSortFactory,
} from './gene.js';
import {
    intermineTraitAttributesFactory,
    intermineTraitSortFactory,
} from './trait.js';

export const intermineGeneFunctionAttributes = [
    ...intermineAnnotatableAttributesFactory('GeneFunction'),
    'GeneFunction.classicalLocus',
    'GeneFunction.symbol',
    'GeneFunction.symbolLong',
    'GeneFunction.synopsis',
    'GeneFunction.confidence',
    'GeneFunction.dataSets.name',
];
export const intermineGeneFunctionSort = 'GeneFunction.trait.name ASC GeneFunction.symbol ASC';
export type IntermineGeneFunction = [
    ...IntermineAnnotatable,
    string,
    string,
    string,
    string,
    number,
];

export const graphqlGeneFunctionAttributes = [
    ...graphqlAnnotatableAttributes,
    'classicalLocus',
    'symbol',
    'symbolLong',
    'synopsis',
    'confidence',
    'dataSetName',
];
export type GraphQLGeneFunction = {
    [prop in typeof graphqlGeneFunctionAttributes[number]]: string;
}

export type IntermineGeneFunctionResponse = IntermineDataResponse<IntermineGeneFunction>;
export function response2genefunctions(response: IntermineGeneFunctionResponse): Array<GraphQLGeneFunction> {
    return response2graphqlObjects(response, graphqlGeneFunctionAttributes);
}

export const intermineGeneFunctionGenesAttributes = intermineGeneAttributesFactory('GeneFunction.genes');
export const intermineGeneFunctionGenesSort = intermineGeneSortFactory('GeneFunction.genes');
export const intermineGeneFunctionTraitsAttributes = intermineTraitAttributesFactory('GeneFunction.traits');
export const intermineGeneFunctionTraitsSort = intermineTraitSortFactory('GeneFunction.traits');
