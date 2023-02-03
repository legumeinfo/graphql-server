// <class name="GeneFamilyTally" is-interface="true" term="">
// 	<attribute name="tally" type="java.lang.Integer"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<reference name="geneFamily" referenced-type="GeneFamily" reverse-reference="tallies"/>
// </class>
export const intermineGeneFamilyTallyAttributes = [
    'GeneFamilyTally.id',
    'GeneFamilyTally.tally',
    'GeneFamilyTally.organism.id',
    'GeneFamilyTally.geneFamily.id',
];
export const intermineGeneFamilyTallySort = 'GeneFamilyTally.id';


// type GeneFamilyTally {
//   id: ID!
//   tally: Int
//   organism: Organism
//   geneFamily: GeneFamily
// }
export const graphqlGeneFamilyTallyAttributes = [
    'id',
    'tally',
    'organismId',
    'geneFamilyId',
];


export function response2geneFamilyTallies(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlGeneFamilyTallyAttributes);
}
