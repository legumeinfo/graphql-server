import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';

export const intermineDataSetAttributesFactory = (type = 'DataSet') => [
  `${type}.id`,
  `${type}.description`,
  `${type}.licence`,
  `${type}.url`,
  `${type}.name`,
  `${type}.version`,
  `${type}.synopsis`,
  `${type}.dataSource.name`, // resolve reference
  `${type}.publication.doi`, // resolve reference
];

export const intermineDataSetAttributes = intermineDataSetAttributesFactory();

export const intermineDataSetSortFactory = (type = 'DataSet') => `${type}.name`;

export const intermineDataSetSort = intermineDataSetSortFactory('DataSet');

export type IntermineDataSet = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export const graphqlDataSetAttributes = [
  'id',
  'description',
  'licence',
  'url',
  'name',
  'version',
  'synopsis',
  'dataSourceName',
  'publicationDOI',
];

export type GraphQLDataSet = {
  [prop in (typeof graphqlDataSetAttributes)[number]]: string;
};

export type IntermineDataSetResponse = IntermineDataResponse<IntermineDataSet>;

// converts an Intermine response into an array of GraphQL DataSet objects
export function response2dataSets(
  response: IntermineDataSetResponse,
): Array<GraphQLDataSet> {
  return response2graphqlObjects(response, graphqlDataSetAttributes);
}
