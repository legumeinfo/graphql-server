import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


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
        geneFamily: async(phylotree, _, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(phylotree.geneFamilyIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSets: async (phylotree, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForPhylotree(phylotree, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        nodes: async (phylotree, { start, size }, { dataSources }) => {
            const args = {phylotree, start, size};
            return dataSources[sourceName].getPhylonodes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
