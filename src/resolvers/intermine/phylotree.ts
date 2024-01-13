import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableInterfaceFactory } from './annotatable-interface.js';

export const phylotreeFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        phylotree: async (_, { identifier }, { dataSources }) => {
            const {data: tree} = await dataSources[sourceName].getPhylotree(identifier);
            if (tree == null) {
                const msg = `Phylotree with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: tree};
        },
    },
    Phylotree: {
        ...annotatableInterfaceFactory(sourceName),
        geneFamily: async(phylotree, _, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(phylotree.geneFamilyIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        newick: async(phylotree, _, { dataSources }) => {
            return dataSources[sourceName].getNewick(phylotree)
                // @ts-ignore: implicit type any error
                .then(({data: newick}) => {
                    if (newick != null) return newick.contents;
                    return null;
                });
        },
        nodes: async (phylotree, { page, pageSize }, { dataSources }) => {
            const args = {phylotree, page, pageSize};
            return dataSources[sourceName].getPhylonodes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
