import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  intermineGeneFamilyAssignmentAttributesFactory,
  intermineGeneFamilyAssignmentSortFactory,
} from './gene-family-assignment.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

export const intermineGeneAttributesFactory = (type = 'Gene') => [
    ...intermineSequenceFeatureAttributesFactory(type),
    `${type}.briefDescription`,
    `${type}.ensemblName`,
    `${type}.upstreamIntergenicRegion.primaryIdentifier`,   // reference resolution
    `${type}.downstreamIntergenicRegion.primaryIdentifier`, // reference resolution
];
export const intermineGeneAttributes = intermineGeneAttributesFactory('Gene');

export const intermineGeneSortFactory = (type = 'Gene') => `${type}.primaryIdentifier`;
export const intermineGeneSort = intermineGeneSortFactory();

export type IntermineGene = [
    ...IntermineSequenceFeature,
    string,
    string,
    string,
    string,
];

export const graphqlGeneAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'briefDescription',
    'ensemblName',
    'upstreamIntergenicRegionIdentifier',
    'downstreamIntergenicRegionIdentifier',
];

export type GraphQLGene = {
    [prop in typeof graphqlGeneAttributes[number]]: string;
}

export type IntermineGeneResponse = IntermineDataResponse<IntermineGene>;

// converts an Intermine response into an array of GraphQL Gene objects
export function response2genes(response: IntermineGeneResponse): Array<GraphQLGene> {
    return response2graphqlObjects(response, graphqlGeneAttributes);
}

// GeneFamilyAssignment does not have reverse reference - have to query Gene to get its assignments
export const intermineGeneGeneFamilyAssignmentsAttributes = intermineGeneFamilyAssignmentAttributesFactory('Gene.geneFamilyAssignments.id');
export const intermineGeneGeneFamilyAssignmentsSort = intermineGeneFamilyAssignmentSortFactory('Gene.geneFamilyAssignments');
