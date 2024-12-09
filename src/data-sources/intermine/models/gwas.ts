import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    IntermineAnnotatable,
    graphqlAnnotatableAttributes,
    intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const intermineGWASAttributes = [
    ...intermineAnnotatableAttributesFactory('GWAS'),
    'GWAS.description',
    'GWAS.genotypes',
    'GWAS.genotypingMethod',
    'GWAS.synopsis',
    'GWAS.genotypingPlatform.primaryIdentifier',
    'GWAS.organism.taxonId',
];
export const intermineGWASSort = 'GWAS.primaryIdentifier';
export type IntermineGWAS = [
    ...IntermineAnnotatable,
    string,
    string,
    string,
    string,
    string,
    number,
];

export const graphqlGWASAttributes = [
    ...graphqlAnnotatableAttributes,
    'description',
    'genotypes',
    'genotypingMethod',
    'synopsis',
    'genotypingPlatformIdentifier',
    'organismTaxonId',
];
export type GraphQLGWAS = {
    [prop in typeof graphqlGWASAttributes[number]]: string;
}

export type IntermineGWASResponse = IntermineDataResponse<IntermineGWAS>;
export function response2gwas(response: IntermineGWASResponse): Array<GraphQLGWAS> {
    return response2graphqlObjects(response, graphqlGWASAttributes);
}
