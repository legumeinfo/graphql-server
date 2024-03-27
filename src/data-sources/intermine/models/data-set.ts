import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

export const intermineDataSetAttributesFactory = (type = 'DataSet') => [
    `${type}.id`,
    `${type}.description`,
    `${type}.licence`,
    `${type}.url`,
    `${type}.name`,
    `${type}.version`,
    `${type}.synopsis`,
    `${type}.dataSource.name`,  // resolve reference
    `${type}.publication.doi`,  // resolve reference
];

export const intermineDataSetAttributes = intermineDataSetAttributesFactory();

export const intermineDataSetSortFactory = (type = 'DataSet') => `${type}.name`;  // guaranteed not null

export const intermineDataSetSort = intermineDataSetSortFactory('DataSet.name');

export type IntermineDataSet = [
    number, // id
    string, // description
    string, // licence
    string, // url
    string, // name
    string, // version
    string, // synopsis
    string, // dataSource.name
    string, // publication.doi
];

export const graphqlDataSetAttributes = [
    'id',             // id
    'description',    // description
    'licence',        // licence
    'url',            // url
    'name',           // name
    'version',        // version
    'synopsis',       // synopsis
    'dataSourceName', // dataSource.name
    'publicationDOI', // publication.doi
];

export type GraphQLDataSet = {
    [prop in typeof graphqlDataSetAttributes[number]]: string;
}

export type IntermineDataSetResponse = IntermineDataResponse<IntermineDataSet>;

// converts an Intermine response into an array of GraphQL DataSet objects
export function response2dataSets(response: IntermineDataSetResponse): Array<GraphQLDataSet> {
    return response2graphqlObjects(response, graphqlDataSetAttributes);
}
