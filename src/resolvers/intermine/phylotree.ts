import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const phylotreeFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        phylotree: async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getPhylotree(identifier);
        },
    },
    Phylotree: {
        geneFamily: async(phylotree, _, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(phylotree.geneFamilyIdentifier);
        },
        dataSets: async (phylotree, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForPhylotree(phylotree, args);
        },
        nodes: async (phylotree, { start, size }, { dataSources }) => {
            const args = {phylotree, start, size};
            return dataSources[sourceName].getPhylonodes(args);
        },
    },
});
