// <class name="GeneFamilyAssignment" is-interface="true" term="">
// 	<attribute name="bestDomainScore" type="java.lang.Double"/>
// 	<attribute name="score" type="java.lang.Double"/>
// 	<attribute name="evalue" type="java.lang.Double"/>
// 	<reference name="geneFamily" referenced-type="GeneFamily"/>
// </class>
const intermineGeneFamilyAssignmentAttributes = [
    'GeneFamilyAssignment.id',
    'GeneFamilyAssignment.bestDomainScore',
    'GeneFamilyAssignment.score',
    'GeneFamilyAssignment.evalue',
    'GeneFamilyAssignment.geneFamily.id', // internal resolution of GeneFamily
];
const intermineGeneFamilyAssignmentSort = 'GeneFamilyAssignment.evalue';

// type GeneFamilyAssignment {
//   id: ID!
//   bestDomainScore: Float
//   score:  Float
//   evalue: Float
//   geneFamily: GeneFamily!
// }
const graphqlGeneFamilyAssignmentAttributes = [
    'id',
    'bestDomainScore',
    'score',
    'evalue',
    'geneFamilyId', // internal resolution of GeneFamily
];

function response2geneFamilyAssignments(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlGeneFamilyAssignmentAttributes);
}

// GeneFamilyAssignment does not have reverse reference - have to query Gene to get its assignments
const intermineGeneGeneFamilyAssignmentsAttributes = [
    'Gene.geneFamilyAssignments.id',
    'Gene.geneFamilyAssignments.bestDomainScore',
    'Gene.geneFamilyAssignments.score',
    'Gene.geneFamilyAssignments.evalue',
    'Gene.geneFamilyAssignments.geneFamily.id', // internal resolution of GeneFamily
];
const intermineGeneGeneFamilyAssignmentsSort = 'Gene.geneFamilyAssignments.geneFamily.primaryIdentifier';

// GeneFamilyAssignment does not have reverse reference - have to query Protein to get its assignments
const intermineProteinGeneFamilyAssignmentsAttributes = [
    'Protein.geneFamilyAssignments.id',
    'Protein.geneFamilyAssignments.bestDomainScore',
    'Protein.geneFamilyAssignments.score',
    'Protein.geneFamilyAssignments.evalue',
    'Protein.geneFamilyAssignments.geneFamily.id', // internal resolution of GeneFamily
];
const intermineProteinGeneFamilyAssignmentsSort = 'Protein.geneFamilyAssignments.geneFamily.primaryIdentifier';


module.exports = {
    intermineGeneFamilyAssignmentAttributes,
    intermineGeneFamilyAssignmentSort,
    graphqlGeneFamilyAssignmentAttributes,
    response2geneFamilyAssignments,

    intermineGeneGeneFamilyAssignmentsAttributes,
    intermineGeneGeneFamilyAssignmentsSort,

    intermineProteinGeneFamilyAssignmentsAttributes,
    intermineProteinGeneFamilyAssignmentsSort,
};
