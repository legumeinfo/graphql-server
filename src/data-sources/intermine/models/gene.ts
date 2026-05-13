import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  intermineGeneFamilyAssignmentAttributesFactory,
  intermineGeneFamilyAssignmentSortFactory,
} from './gene-family-assignment.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

// Base attributes - core gene fields without optional intergenic region relationships
export const intermineGeneBaseAttributesFactory = (type = 'Gene') => [
  ...intermineSequenceFeatureAttributesFactory(type),
  `${type}.briefDescription`,
  `${type}.ensemblName`,
];
export const intermineGeneBaseAttributes =
  intermineGeneBaseAttributesFactory('Gene');

// Extended attributes - includes intergenic region identifiers (use with OUTER joins)
export const intermineGeneAttributesFactory = (type = 'Gene') => [
  ...intermineGeneBaseAttributesFactory(type),
  `${type}.upstreamIntergenicRegion.primaryIdentifier`,
  `${type}.downstreamIntergenicRegion.primaryIdentifier`,
];
export const intermineGeneAttributes = intermineGeneAttributesFactory('Gene');

export const intermineGeneSortFactory = (type = 'Gene') =>
  `${type}.primaryIdentifier`;
export const intermineGeneSort = intermineGeneSortFactory();

// Type for base attributes response
export type IntermineGeneBase = [...IntermineSequenceFeature, string, string];

// Type for extended attributes response (includes nullable intergenic region identifiers)
export type IntermineGene = [
  ...IntermineSequenceFeature,
  string,
  string,
  string | null,
  string | null,
];

// Base GraphQL attributes
export const graphqlGeneBaseAttributes = [
  ...graphqlSequenceFeatureAttributes,
  'briefDescription',
  'ensemblName',
];

// Extended GraphQL attributes
export const graphqlGeneAttributes = [
  ...graphqlGeneBaseAttributes,
  'upstreamIntergenicRegionIdentifier',
  'downstreamIntergenicRegionIdentifier',
];

export type GraphQLGene = {
  [prop in (typeof graphqlGeneAttributes)[number]]: string;
};

export type IntermineGeneResponse = IntermineDataResponse<IntermineGene>;

// Converts an Intermine response into an array of GraphQL Gene objects
export function response2genes(
  response: IntermineGeneResponse,
): Array<GraphQLGene> {
  return response2graphqlObjects(response, graphqlGeneAttributes);
}

// GeneFamilyAssignment does not have reverse reference - have to query Gene to get its assignments
export const intermineGeneGeneFamilyAssignmentsAttributes =
  intermineGeneFamilyAssignmentAttributesFactory('Gene.geneFamilyAssignments');
export const intermineGeneGeneFamilyAssignmentsSort =
  intermineGeneFamilyAssignmentSortFactory('Gene.geneFamilyAssignments');

//export const intermineGeneGeneFamilyAssignmentsAttributes = [
//  'Gene.geneFamilyAssignments.id',
//  'Gene.geneFamilyAssignments.bestDomainScore',
//  'Gene.geneFamilyAssignments.score',
//  'Gene.geneFamilyAssignments.evalue',
//  'Gene.geneFamilyAssignments.geneFamily.primaryIdentifier',
//  'Gene.geneFamilyAssignments.protein.primaryIdentifier',
//];
//
//export const intermineGeneGeneFamilyAssignmentsSort =
//  'Gene.geneFamilyAssignments.geneFamily.primaryIdentifier';
