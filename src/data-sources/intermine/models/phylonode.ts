import { Response, response2graphqlObjects } from '../intermine.server.js';


// Phylonode InterMine path query attributes
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
  number,
  string,
  boolean,
  number,
  number,
  boolean,
  string,
  string,
  number,
];


export const graphqlPhylonodeAttributes = [
    'id',
    'identifier',
    'isRoot',
    'length',
    'numChildren',
    'isLeaf',
    'proteinIdentifier',
    'treeIdentifier',
    'parentId',
];
export type GraphQLPhylonode = {
  [prop in typeof graphqlPhylonodeAttributes[number]]: string;
}


export type InterminePhylonodeResponse = Response<InterminePhylonode>;
export function response2phylonodes(response: InterminePhylonodeResponse): Array<GraphQLPhylonode> {
    return response2graphqlObjects(response, graphqlPhylonodeAttributes);
}
