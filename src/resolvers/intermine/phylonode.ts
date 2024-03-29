import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const phylonodeFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        phylonode: async (_, { id }, { dataSources }) => {
            const {data: node} = await dataSources[sourceName].getPhylonode(id);
            if (node == null) {
                const msg = `Phylonode with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: node};
        },
    },
    Phylonode: {
        protein: async(phylonode, _, { dataSources }) => {
            return dataSources[sourceName].getProtein(phylonode.proteinId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        tree: async(phylonode, _, { dataSources }) => {
            return dataSources[sourceName].getPhylotree(phylonode.treeId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        parent: async(phylonode, _, { dataSources }) => {
            return dataSources[sourceName].getPhylonode(phylonode.parentId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        children: async (phylonode, { page, pageSize }, { dataSources }) => {
            const args = {parent: phylonode, page, pageSize};
            return dataSources[sourceName].getPhylonodes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
