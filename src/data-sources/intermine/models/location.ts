import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  intermineDataSetAttributesFactory,
  intermineDataSetSortFactory,
} from './data-set.js';

export const intermineLocationAttributes = [
    'Location.id',
    'Location.strand',
    'Location.start',
    'Location.end',
    'Location.locatedOn.primaryIdentifier',
];
export const intermineLocationSort = 'Location.start';
export type IntermineLocation = [
  number,
  string,
  number,
  number,
  string,
];

export const graphqlLocationAttributes = [
    'id',
    'strand',
    'start',
    'end',
    'locatedOnIdentifier',
];
export type GraphQLLocation = {
  [prop in typeof graphqlLocationAttributes[number]]: string;
}


export type IntermineLocationResponse = IntermineDataResponse<IntermineLocation>;
// converts an Intermine response into an array of GraphQL Location objects
export function response2locations(response: IntermineLocationResponse): Array<GraphQLLocation> {
    return response2graphqlObjects(response, graphqlLocationAttributes);
}

// Location.dataSets has no reverse reference
export const intermineLocationDataSetAttributes = intermineDataSetAttributesFactory('Location.dataSets');
export const intermineLocationDataSetSort = intermineDataSetSortFactory('Location.dataSets');
