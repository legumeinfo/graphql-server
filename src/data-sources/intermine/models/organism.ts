import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  intermineDataSetAttributesFactory,
  intermineDataSetSortFactory,
} from './data-set.js';

export const intermineOrganismAttributes = [
    'Organism.id',
    'Organism.taxonId',
    'Organism.abbreviation',
    'Organism.name',
    'Organism.commonName',
    'Organism.description',
    'Organism.genus',
    'Organism.species',
];
export const intermineOrganismSort = 'Organism.genus';
export type IntermineOrganism = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export const graphqlOrganismAttributes = [
    'id',
    'taxonId',
    'abbreviation',
    'name',
    'commonName',
    'description',
    'genus',
    'species',
];

export type GraphQLOrganism = {
  [prop in typeof graphqlOrganismAttributes[number]]: string;
}


export type IntermineOrganismResponse = IntermineDataResponse<IntermineOrganism>;
export function response2organisms(response: IntermineOrganismResponse): Array<GraphQLOrganism> {
    return response2graphqlObjects(response, graphqlOrganismAttributes);
}

// Organism.dataSets has no reverse reference
export const intermineOrganismDataSetAttributes = intermineDataSetAttributesFactory('Organism.dataSets.id');
export const intermineOrganismDataSetSort = intermineDataSetSortFactory('Organism.dataSets');
