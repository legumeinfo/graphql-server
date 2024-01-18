import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="ExpressionValue" extends="java.lang.Object" is-interface="false" term="">
//     <attribute name="value" type="java.lang.Double"/>
//     <reference name="sample" referenced-type="ExpressionSample"/>
//     <reference name="feature" referenced-type="SequenceFeature"/>
// </class>
// NOTE 1: this is not an interface, and therefore does NOT have an id.
// NOTE 2: although ExpressionValue references a SequenceFeature, we reference a Gene here.
export const intermineExpressionValueAttributes = [
    'ExpressionValue.value',
    'ExpressionValue.sample.primaryIdentifier',
    'ExpressionValue.feature.id',               // id for getSequenceFeature(id)
];
export const intermineExpressionValueSort = 'ExpressionValue.sample.primaryIdentifier';

export type IntermineExpressionValue = [
  number, // value
  string, // sample.primaryIdentifier
  number, // feature.id
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
