import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    intermineDataSetAttributesFactory,
    intermineDataSetSortFactory,
} from './data-set.js';


export const intermineStrainAttributes = [
    'Strain.id',
    'Strain.identifier',
    'Strain.name',
    'Strain.description',
    'Strain.origin',
    'Strain.accession',
    'Strain.organism.taxonId',
];
export const intermineStrainSort = 'Strain.identifier';
export type IntermineStrain = [
    number,
    string,
    string,
    string,
    string,
    string,
    number,
];


export const graphqlStrainAttributes = [
    'id',
    'identifier',
    'name',
    'description',
    'origin',
    'accession',
    'organismTaxonId',
];
export type GraphQLStrain = {
    [prop in typeof graphqlStrainAttributes[number]]: string;
}


export type IntermineStrainResponse = IntermineDataResponse<IntermineStrain>;
export function response2strains(response: IntermineStrainResponse): Array<GraphQLStrain> {
    return response2graphqlObjects(response, graphqlStrainAttributes);
}

// Strain.dataSets has no reverse reference
export const intermineStrainDataSetAttributes = intermineDataSetAttributesFactory('Strain.dataSets.id');
export const intermineStrainDataSetSort = intermineDataSetSortFactory('Strain.dataSets');
