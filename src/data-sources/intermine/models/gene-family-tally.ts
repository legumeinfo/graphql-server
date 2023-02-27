import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="GeneFamilyTally" is-interface="true" term="">
// 	<attribute name="tally" type="java.lang.Integer"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<reference name="geneFamily" referenced-type="GeneFamily" reverse-reference="tallies"/>
// </class>
export const intermineGeneFamilyTallyAttributes = [
    'GeneFamilyTally.id',
    'GeneFamilyTally.tally',
    'GeneFamilyTally.organism.taxonId',
    'GeneFamilyTally.geneFamily.primaryIdentifier',
];
export const intermineGeneFamilyTallySort = 'GeneFamilyTally.id';
export type IntermineGeneFamilyTally = [
  number,
  number,
  number,
  string,
];


// type GeneFamilyTally {
//   id: ID!
//   tally: Int
//   organism: Organism
//   geneFamily: GeneFamily
// }
export const graphqlGeneFamilyTallyAttributes = [
    'id',
    'tally',
    'organismTaxonId',
    'geneFamilyIdentifier',
];
export type GraphQLGeneFamilyTally = {
  [prop in typeof graphqlGeneFamilyTallyAttributes[number]]: string;
}


export type IntermineGeneFamilyTallyResponse = Response<IntermineGeneFamilyTally>;
export function response2geneFamilyTallies(response: IntermineGeneFamilyTallyResponse): Array<GraphQLGeneFamilyTally> {
    return response2graphqlObjects(response, graphqlGeneFamilyTallyAttributes);
}
