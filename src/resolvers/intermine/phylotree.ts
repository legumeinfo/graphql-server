import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';

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
        ...annotatableFactory(sourceName),
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
            const { id } = phylotree;
            return dataSources[sourceName].getPhylonodesForPhylotree(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
