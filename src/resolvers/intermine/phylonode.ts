import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';

export const phylonodeFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        phylonode: async (_, { identifier }, { dataSources }) => {
            const {data: node} = await dataSources[sourceName].getPhylonode(identifier);
            if (node == null) {
                const msg = `Phylonode with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: node};
        },
    },
    Phylonode: {
        protein: async(phylonode, _, { dataSources }) => {
            if (phylonode.proteinIdentifier != null) {
                return dataSources[sourceName].getProtein(phylonode.proteinIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            }
        },
        tree: async(phylonode, _, { dataSources }) => {
            return dataSources[sourceName].getPhylotree(phylonode.treeIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        parent: async(phylonode, _, { dataSources }) => {
            if (phylonode.parentIdentifier != null) {
                return dataSources[sourceName].getPhylonode(phylonode.parentIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            }
        },
        children: async (phylonode, { page, pageSize }, { dataSources }) => {
            const args = {parent: phylonode, page, pageSize};
            return dataSources[sourceName].getPhylonodes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
