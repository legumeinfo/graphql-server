import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineBioEntity,
  graphqlBioEntityAttributes,
  intermineBioEntityAttributesFactory,
} from './bio-entity.js';
import {
  intermineGeneFamilyAssignmentAttributesFactory,
  intermineGeneFamilyAssignmentSortFactory,
} from './gene-family-assignment.js';

export const intermineProteinAttributes = [
    ...intermineBioEntityAttributesFactory('Protein'),
    'Protein.md5checksum',
    'Protein.primaryAccession',
    'Protein.molecularWeight',
    'Protein.length',
    'Protein.isPrimary',
    'Protein.transcript.primaryIdentifier',
];
export const intermineProteinSort = 'Protein.primaryIdentifier';
export type IntermineProtein = [
  ...IntermineBioEntity,
  string,
  string,
  number,
  number,
  boolean,
  string,
];

export const graphqlProteinAttributes = [
    ...graphqlBioEntityAttributes,
    'md5checksum',
    'primaryAccession',
    'molecularWeight',
    'length',
    'isPrimary',
    'transcriptIdentifier',
];
export type GraphQLProtein = {
  [prop in typeof graphqlProteinAttributes[number]]: string;
}


export type IntermineProteinResponse = IntermineDataResponse<IntermineProtein>;
// converts an Intermine response into an array of GraphQL Protein objects
export function response2proteins(response: IntermineProteinResponse): Array<GraphQLProtein> {
    return response2graphqlObjects(response, graphqlProteinAttributes);
}


// GeneFamilyAssignment does not have reverse reference - have to query Protein to get its assignments
export const intermineProteinGeneFamilyAssignmentsAttributes = intermineGeneFamilyAssignmentAttributesFactory('Protein.geneFamilyAssignments.id');
export const intermineProteinGeneFamilyAssignmentsSort = intermineGeneFamilyAssignmentSortFactory('Protein.geneFamilyAssignments');
