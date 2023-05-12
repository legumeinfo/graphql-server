import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="GeneFamily" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="version" type="java.lang.String"/>
// 	<attribute name="size" type="java.lang.Integer"/>
// 	<reference name="phylotree" referenced-type="Phylotree" reverse-reference="geneFamily"/>
// 	<collection name="genes" referenced-type="Gene"/>
// 	<collection name="proteins" referenced-type="Protein"/>
// 	<collection name="proteinDomains" referenced-type="ProteinDomain" reverse-reference="geneFamilies"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// 	<collection name="tallies" referenced-type="GeneFamilyTally" reverse-reference="geneFamily"/>
// </class>
export const intermineGeneFamilyAttributes = [
    'GeneFamily.id',
    'GeneFamily.primaryIdentifier',
    'GeneFamily.description',
    'GeneFamily.version',
    'GeneFamily.size',
];
export const intermineGeneFamilySort = 'GeneFamily.primaryIdentifier';
export type IntermineGeneFamily = [
  number,
  string,
  string,
  string,
  number,
];


// type GeneFamily implements Annotatable {
//   id: ID!
//   identifier: String!
//   # ontologyAnnotations
//   # publications
//   description: String
//   version: String
//   size: Int
//   phylotree: Phylotree
//   genes: [Gene]
//   # proteins: [Protein]
//   proteinDomains: [ProteinDomain]
//   # tallies: [GeneFamilyTally]
// }
export const graphqlGeneFamilyAttributes = [
    'id',
    'identifier',
    'description',
    'version',
    'size',
];
export type GraphQLGeneFamily = {
  [prop in typeof graphqlGeneFamilyAttributes[number]]: string;
}


export type IntermineGeneFamilyResponse = Response<IntermineGeneFamily>;
export function response2geneFamilies(response: IntermineGeneFamilyResponse): Array<GraphQLGeneFamily> {
    return response2graphqlObjects(response, graphqlGeneFamilyAttributes);
}
