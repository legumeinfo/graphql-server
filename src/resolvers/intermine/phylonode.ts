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
            const {parentIdentifier} = phylonode;
            if (parentIdentifier != null) {
                return dataSources[sourceName].getPhylonode(parentIdentifier)
                    // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            }
            return null;
        },
        children: async (phylonode, { page, pageSize }, { dataSources }) => {
            const {id} = phylonode;
            return dataSources[sourceName].getChildrenForPhylonode(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
