import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="Phylotree" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="numLeaves" type="java.lang.Integer"/>
// 	<reference name="geneFamily" referenced-type="GeneFamily" reverse-reference="phylotree"/>
// 	<collection name="nodes" referenced-type="Phylonode" reverse-reference="tree"/>
// </class>
export const interminePhylotreeAttributes = [
    'Phylotree.id',                           // Annotatable
    'Phylotree.primaryIdentifier',            // Annotatable
    'Phylotree.numLeaves',
    'Phylotree.geneFamily.primaryIdentifier', // resolve reference
];
export const interminePhylotreeSort = 'Phylotree.primaryIdentifier';

export type InterminePhylotree = [
  number, // id
  string, // primaryIdentifier
  number, // numLeaves
  string, // geneFamily.primaryIdentifier
];

export const graphqlPhylotreeAttributes = [
    'id',                   // id
    'identifier',           // primaryIdentifier
    'numLeaves',            // numLeaves
    'geneFamilyIdentifier', // resolve GeneFamily
];

export type GraphQLPhylotree = {
  [prop in typeof graphqlPhylotreeAttributes[number]]: string;
}

export type InterminePhylotreeResponse = IntermineDataResponse<InterminePhylotree>;

export function response2phylotrees(response: InterminePhylotreeResponse): Array<GraphQLPhylotree> {
    return response2graphqlObjects(response, graphqlPhylotreeAttributes);
}
