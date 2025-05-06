import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';

export const intermineDataSourceAttributes = [
  'DataSource.id',
  'DataSource.description',
  'DataSource.url',
  'DataSource.name',
];
export const intermineDataSourceSort = 'DataSource.name';

export type IntermineDataSource = [number, string, string, string];

export const graphqlDataSourceAttributes = ['id', 'description', 'url', 'name'];

export type GraphQLDataSource = {
  [prop in (typeof graphqlDataSourceAttributes)[number]]: string;
};

export type IntermineDataSourceResponse =
  IntermineDataResponse<IntermineDataSource>;

// converts an Intermine response into an array of GraphQL DataSource objects
export function response2dataSources(
  response: IntermineDataSourceResponse,
): Array<GraphQLDataSource> {
  return response2graphqlObjects(response, graphqlDataSourceAttributes);
}
