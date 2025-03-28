import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    IntermineAnnotatable,
    graphqlAnnotatableAttributes,
    intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const intermineExpressionSampleAttributes = [
    ...intermineAnnotatableAttributesFactory('ExpressionSample'),
    'ExpressionSample.tissue',
    'ExpressionSample.num',
    'ExpressionSample.description',
    'ExpressionSample.replicateGroup',
    'ExpressionSample.treatment',
    'ExpressionSample.bioSample',
    'ExpressionSample.sraExperiment',
    'ExpressionSample.species',
    'ExpressionSample.genotype',
    'ExpressionSample.name',
    'ExpressionSample.developmentStage',
    'ExpressionSample.source.primaryIdentifier',
];
export const intermineExpressionSampleSort = 'ExpressionSample.primaryIdentifier';
export type IntermineExpressionSample = [
    ...IntermineAnnotatable,
    string,
    number,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
];

export const graphqlExpressionSampleAttributes = [
    ...graphqlAnnotatableAttributes,
    'tissue',
    'num',
    'description',
    'replicateGroup',
    'treatment',
    'bioSample',
    'sraExperiment',
    'species',
    'genotype',
    'name',
    'developmentStage',
    'sourceIdentifier',
];
export type GraphQLExpressionSample = {
    [prop in typeof graphqlExpressionSampleAttributes[number]]: string;
}

export type IntermineExpressionSampleResponse = IntermineDataResponse<IntermineExpressionSample>;
export function response2expressionSamples(response: IntermineExpressionSampleResponse): Array<GraphQLExpressionSample> {
    return response2graphqlObjects(response, graphqlExpressionSampleAttributes);
}
