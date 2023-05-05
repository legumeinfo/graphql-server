import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const phylonodeFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        phylonode: async (_, { id }, { dataSources }) => {
            const node = dataSources[sourceName].getPhylonode(id);
            if (node == null) {
                const msg = `Phylonode with ID '${id}' not found`;
                inputError(msg);
            }
            return node;
        },
    },
    Phylonode: {
        protein: async(phylonode, _, { dataSources }) => {
            return dataSources[sourceName].getProtein(phylonode.proteinId);
        },
        tree: async(phylonode, _, { dataSources }) => {
            return dataSources[sourceName].getPhylotree(phylonode.treeId);
        },
        parent: async(phylonode, _, { dataSources }) => {
            return dataSources[sourceName].getPhylonode(phylonode.parentId);
        },
        children: async (phylonode, { start, size }, { dataSources }) => {
            const args = {parent: phylonode, start, size};
            return dataSources[sourceName].getPhylonodes(args);
        },
    },
});
