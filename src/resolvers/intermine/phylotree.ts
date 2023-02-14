import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const phylotreeFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        phylotree: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getPhylotree(id);
        },
    },
    Phylotree: {
        geneFamily: async(phylotree, { }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(phylotree.geneFamilyId);
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
