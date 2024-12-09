import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

export const intermineGeneFamilyAssignmentAttributesFactory = (type = 'GeneFamilyAssignment') => [
    `${type}.id`,
    `${type}.bestDomainScore`,
    `${type}.score`,
    `${type}.evalue`,
    `${type}.geneFamily.primaryIdentifier`,
    `${type}.protein.primaryIdentifier`,
];

export const intermineGeneFamilyAssignmentAttributes = intermineGeneFamilyAssignmentAttributesFactory();

export const intermineGeneFamilyAssignmentSortFactory = (type = 'GeneFamilyAssignment') => `${type}.geneFamily.primaryIdentifier`;
export const intermineGeneFamilyAssignmentSort = intermineGeneFamilyAssignmentSortFactory();
export type IntermineGeneFamilyAssignment = [
    number,
    number,
    number,
    number,
    string,
    string,
];

export const graphqlGeneFamilyAssignmentAttributes = [
    'id',
    'bestDomainScore',
    'score',
    'evalue',
    'geneFamilyIdentifier',
    'proteinIdentifier',
];
export type GraphQLGeneFamilyAssignment = {
    [prop in typeof graphqlGeneFamilyAssignmentAttributes[number]]: string;
}


export type IntermineGeneFamilyAssignmentResponse = IntermineDataResponse<IntermineGeneFamilyAssignment>;
export function response2geneFamilyAssignments(response: IntermineGeneFamilyAssignmentResponse): Array<GraphQLGeneFamilyAssignment>{
    return response2graphqlObjects(response, graphqlGeneFamilyAssignmentAttributes);
}
