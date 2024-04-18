import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

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

export type InterminePhylonodeResponse = IntermineDataResponse<InterminePhylonode>;
export function response2phylonodes(response: InterminePhylonodeResponse): Array<GraphQLPhylonode> {
    return response2graphqlObjects(response, graphqlPhylonodeAttributes);
}
