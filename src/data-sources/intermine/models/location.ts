import {
    IntermineDataResponse,
    objectsResponse2response,
    response2graphqlObjects,
} from '../intermine.server.js';
import {
    intermineDataSetAttributesFactory,
    intermineDataSetSortFactory,
} from './data-set.js';

export const intermineLocationQueryFormat = 'jsonobjects';

export const intermineLocationAttributes = [
    'Location.id',
    'Location.strand',
    'Location.start',
    'Location.end',
    'Location.feature.primaryIdentifier',
    'Location.locatedOn.primaryIdentifier',
];
export const intermineLocationSort = 'Location.start';

export type IntermineLocationObject = {
    objectId: number,
    strand: string,
    start: number,
    end: number,
    feature: {class: string, primaryIdentifier: string},
    locatedOn: {class: string, objectId: string},
};

export const intermineLocationObjectAttributes = [
    'Location.objectId',
    'Location.strand',
    'Location.start',
    'Location.end',
    'Location.feature.class',
    'Location.feature.primaryIdentifier',
    'Location.locatedOn.class',
    'Location.locatedOn.primaryIdentifier',
];

export type IntermineLocation = [
    number,
    string,
    number,
    number,
    string,
    string,
    string,
    number,
];

export const graphqlLocationAttributes = [
    'id',
    'strand',
    'start',
    'end',
    'featureClass',
    'featureIdentifier',
    'locatedOnClass',
    'locatedOnIdentifier',
];
export type GraphQLLocation = {
  [prop in typeof graphqlLocationAttributes[number]]: string;
}


export type IntermineLocationResponse = IntermineDataResponse<IntermineLocationObject>;
// converts an Intermine jsonobjects response into an array of GraphQL Location objects
export function response2locations(response: IntermineLocationResponse): Array<GraphQLLocation> {
    const jsonResponse = objectsResponse2response(response, intermineLocationObjectAttributes);
    return response2graphqlObjects(jsonResponse, graphqlLocationAttributes);
}

// Location.dataSets has no reverse reference
export const intermineLocationDataSetAttributes = intermineDataSetAttributesFactory('Location.dataSets');
export const intermineLocationDataSetSort = intermineDataSetSortFactory('Location.dataSets');
