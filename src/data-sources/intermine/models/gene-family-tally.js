// <class name="GeneFamilyTally" is-interface="true" term="">
// 	<attribute name="tally" type="java.lang.Integer"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<reference name="geneFamily" referenced-type="GeneFamily" reverse-reference="tallies"/>
// </class>
const intermineGeneFamilyTallyAttributes = [
    'GeneFamilyTally.id',
    'GeneFamilyTally.tally',
    'GeneFamilyTally.organism.id',
    'GeneFamilyTally.geneFamily.id',
];
const intermineGeneFamilyTallySort = 'GeneFamilyTally.id';
// type GeneFamilyTally {
//   id: ID!
//   tally: Int
//   organism: Organism
//   geneFamily: GeneFamily
// }
const graphqlGeneFamilyTallyAttributes = [
    'id',
    'tally',
    'organismId',
    'geneFamilyId',
];
function response2geneFamilyTallies(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlGeneFamilyTallyAttributes);
}

module.exports = {
    intermineGeneFamilyTallyAttributes,
    intermineGeneFamilyTallySort,
    graphqlGeneFamilyTallyAttributes,
    response2geneFamilyTallies,
};
