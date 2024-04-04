import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const intermineExpressionSourceAttributes = [
    ...intermineAnnotatableAttributesFactory('ExpressionSource'),
    'ExpressionSource.sra',
    'ExpressionSource.description',
    'ExpressionSource.bioProject',
    'ExpressionSource.unit',
    'ExpressionSource.geoSeries',
    'ExpressionSource.synopsis',
    'ExpressionSource.organism.taxonId',
    'ExpressionSource.strain.identifier',
];
export const intermineExpressionSourceSort = 'ExpressionSource.primaryIdentifier';
export type IntermineExpressionSource = [
  ...IntermineAnnotatable,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
];

export const graphqlExpressionSourceAttributes = [
    ...graphqlAnnotatableAttributes,
    'sra',
    'description',
    'bioProject',
    'unit',
    'geoSeries',
    'synopsis',
    'organismTaxonId',
    'strainIdentifier',
];
export type GraphQLExpressionSource = {
  [prop in typeof graphqlExpressionSourceAttributes[number]]: string;
}

export type IntermineExpressionSourceResponse = IntermineDataResponse<IntermineExpressionSource>;
export function response2expressionSources(response: IntermineExpressionSourceResponse): Array<GraphQLExpressionSource> {
    return response2graphqlObjects(response, graphqlExpressionSourceAttributes);
}
