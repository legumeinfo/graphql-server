import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="GeneFamilyAssignment" is-interface="true" term="">
// 	<attribute name="bestDomainScore" type="java.lang.Double"/>
// 	<attribute name="score" type="java.lang.Double"/>
// 	<attribute name="evalue" type="java.lang.Double"/>
// 	<reference name="geneFamily" referenced-type="GeneFamily"/>
// </class>
export const intermineGeneFamilyAssignmentAttributes = [
    'GeneFamilyAssignment.id',
    'GeneFamilyAssignment.bestDomainScore',
    'GeneFamilyAssignment.score',
    'GeneFamilyAssignment.evalue',
    'GeneFamilyAssignment.geneFamily.id', // internal resolution of GeneFamily
];
export const intermineGeneFamilyAssignmentSort = 'GeneFamilyAssignment.evalue';
export type IntermineGeneFamilyAssignment = [
  number,
  number,
  number,
  number,
  number,
];


// type GeneFamilyAssignment {
//   id: ID!
//   bestDomainScore: Float
//   score:  Float
//   evalue: Float
//   geneFamily: GeneFamily!
// }
export const graphqlGeneFamilyAssignmentAttributes = [
    'id',
    'bestDomainScore',
    'score',
    'evalue',
    'geneFamilyId', // internal resolution of GeneFamily
];
export type GraphQLGeneFamilyAssignment = {
  [prop in typeof graphqlGeneFamilyAssignmentAttributes[number]]: string;
}


export type IntermineGeneFamilyAssignmentResponse = Response<IntermineGeneFamilyAssignment>;
export function response2geneFamilyAssignments(response: IntermineGeneFamilyAssignmentResponse): Array<GraphQLGeneFamilyAssignment>{
    return response2graphqlObjects(response, graphqlGeneFamilyAssignmentAttributes);
}


// GeneFamilyAssignment does not have reverse reference - have to query Gene to get its assignments
export const intermineGeneGeneFamilyAssignmentsAttributes = [
    'Gene.geneFamilyAssignments.id',
    'Gene.geneFamilyAssignments.bestDomainScore',
    'Gene.geneFamilyAssignments.score',
    'Gene.geneFamilyAssignments.evalue',
    'Gene.geneFamilyAssignments.geneFamily.id', // internal resolution of GeneFamily
];
export const intermineGeneGeneFamilyAssignmentsSort = 'Gene.geneFamilyAssignments.geneFamily.primaryIdentifier';
export type IntermineGeneGeneFamilyAssignments = [
  number,
  number,
  number,
  number,
  number,
];


// GeneFamilyAssignment does not have reverse reference - have to query Protein to get its assignments
export const intermineProteinGeneFamilyAssignmentsAttributes = [
    'Protein.geneFamilyAssignments.id',
    'Protein.geneFamilyAssignments.bestDomainScore',
    'Protein.geneFamilyAssignments.score',
    'Protein.geneFamilyAssignments.evalue',
    'Protein.geneFamilyAssignments.geneFamily.id', // internal resolution of GeneFamily
];
export const intermineProteinGeneFamilyAssignmentsSort = 'Protein.geneFamilyAssignments.geneFamily.primaryIdentifier';
export type IntermineProteinGeneFamilyAssignments = [
  number,
  number,
  number,
  number,
  number,
];
