import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    IntermineAnnotatable,
    graphqlAnnotatableAttributes,
    intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const intermineProteinDomainAttributesFactory = (type = 'ProteinDomain') => [
    ...intermineAnnotatableAttributesFactory(type),
    `${type}.description`,
    `${type}.type`,
    `${type}.name`,
    `${type}.shortName`,
];

export const intermineProteinDomainAttributes = intermineProteinDomainAttributesFactory();

export const intermineProteinDomainSortFactory = (type = 'ProteinDomain') => `${type}.primaryIdentifier`;

export const intermineProteinDomainSort = intermineProteinDomainSortFactory();

export type IntermineProteinDomain = [
    ...IntermineAnnotatable,
    string,
    string,
    string,
    string,
];

export const graphqlProteinDomainAttributes = [
    ...graphqlAnnotatableAttributes,
    'description',
    'type',
    'name',
    'shortName',
];
export type GraphQLProteinDomain = {
    [prop in typeof graphqlProteinDomainAttributes[number]]: string;
}


export type IntermineProteinDomainResponse = IntermineDataResponse<IntermineProteinDomain>;
export function response2proteinDomains(response: IntermineProteinDomainResponse): Array<GraphQLProteinDomain> {
    return response2graphqlObjects(response, graphqlProteinDomainAttributes);
}

export const intermineProteinDomainChildFeatureAttributes = intermineProteinDomainAttributesFactory('ProteinDomain.childFeatures');

export const intermineProteinDomainChildFeatureSort = intermineProteinDomainSortFactory('ProteinDomain.childFeatures');

export const intermineProteinDomainParentFeatureAttributes = intermineProteinDomainAttributesFactory('ProteinDomain.parentFeatures');

export const intermineProteinDomainParentFeatureSort = intermineProteinDomainSortFactory('ProteinDomain.parentFeatures');
