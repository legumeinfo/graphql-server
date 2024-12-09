import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    IntermineAnnotatable,
    graphqlAnnotatableAttributes,
    intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const intermineGeneticMapAttributes = [
    ...intermineAnnotatableAttributesFactory('GeneticMap'),
    'GeneticMap.description',
    'GeneticMap.genotypes',
    'GeneticMap.genotypingMethod',
    'GeneticMap.synopsis',
    'GeneticMap.genotypingPlatform.primaryIdentifier',
    'GeneticMap.organism.taxonId',
];
export const intermineGeneticMapSort = 'GeneticMap.primaryIdentifier';
export type IntermineGeneticMap = [
    ...IntermineAnnotatable,
    string,
    string,
    string,
    string,
    string,
    number,
];

export const graphqlGeneticMapAttributes = [
    ...graphqlAnnotatableAttributes,
    'description',
    'genotypes',
    'genotypingMethod',
    'synopsis',
    'genotypingPlatformIdentifier',
    'organismTaxonId',
];
export type GraphQLGeneticMap = {
    [prop in typeof graphqlGeneticMapAttributes[number]]: string;
}

export type IntermineGeneticMapResponse = IntermineDataResponse<IntermineGeneticMap>;
export function response2geneticMaps(response: IntermineGeneticMapResponse): Array<GraphQLGeneticMap> {
    return response2graphqlObjects(response, graphqlGeneticMapAttributes);
}
