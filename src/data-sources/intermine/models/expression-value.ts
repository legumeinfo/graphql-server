import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

export const intermineExpressionValueAttributes = [
    'ExpressionValue.value',
    'ExpressionValue.sample.primaryIdentifier',
    'ExpressionValue.feature.id',
];
export const intermineExpressionValueSort = 'ExpressionValue.sample.primaryIdentifier';
export type IntermineExpressionValue = [
    number,
    string,
    string,
];

export const graphqlExpressionValueAttributes = [
    'value',
    'sampleIdentifier',
    'featureId',
];
export type GraphQLExpressionValue = {
    [prop in typeof graphqlExpressionValueAttributes[number]]: string;
}


export type IntermineExpressionValueResponse = IntermineDataResponse<IntermineExpressionValue>;
export function response2expressionValues(response: IntermineExpressionValueResponse): Array<GraphQLExpressionValue> {
    return response2graphqlObjects(response, graphqlExpressionValueAttributes);
}
