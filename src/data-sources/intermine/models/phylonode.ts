import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="Phylonode" is-interface="true" term="">
// 	<attribute name="identifier" type="java.lang.String"/>
// 	<attribute name="isRoot" type="java.lang.Boolean"/>
// 	<attribute name="length" type="java.lang.Double"/>
// 	<attribute name="numChildren" type="java.lang.Integer"/>
// 	<attribute name="isLeaf" type="java.lang.Boolean"/>
// 	<reference name="protein" referenced-type="Protein" reverse-reference="phylonode"/>
// 	<reference name="tree" referenced-type="Phylotree" reverse-reference="nodes"/>
// 	<reference name="parent" referenced-type="Phylonode" reverse-reference="children"/>
// 	<collection name="children" referenced-type="Phylonode" reverse-reference="parent"/>
// </class>
export const interminePhylonodeAttributes = [
    'Phylonode.id',
    'Phylonode.identifier',
    'Phylonode.isRoot',
    'Phylonode.length',
    'Phylonode.numChildren',
    'Phylonode.isLeaf',
    'Phylonode.protein.primaryIdentifier',
    'Phylonode.tree.primaryIdentifier',
    'Phylonode.parent.id',
];
export const interminePhylonodeSort = 'Phylonode.identifier';

export type InterminePhylonode = [
  number,  // id
  string,  // identifier
  boolean, // isRoot
  number,  // length
  number,  // numChildren
  boolean, // isLeaf
  string,  // protein.primaryIdentifier
  string,  // tree.primaryIdentifier
  number,  // parent.id
];

export const graphqlPhylonodeAttributes = [
    'id',                // id
    'identifier',        // identifier
    'isRoot',            // isRoot
    'length',            // length
    'numChildren',       // numChildren
    'isLeaf',            // isLeaf
    'proteinIdentifier', // resolve Protein
    'treeIdentifier',    // resolve Phylotree
    'parentId',          // resolve parent Phylonode
];

export type GraphQLPhylonode = {
  [prop in typeof graphqlPhylonodeAttributes[number]]: string;
}

export type InterminePhylonodeResponse = IntermineDataResponse<InterminePhylonode>;

export function response2phylonodes(response: InterminePhylonodeResponse): Array<GraphQLPhylonode> {
    return response2graphqlObjects(response, graphqlPhylonodeAttributes);
}
