import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const syntenyBlockFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        syntenyBlock: async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getSyntenyBlock(id);
        },
    },
    SyntenyBlock: {
        syntenicRegions: async (syntenyBlock, { start, size }, { dataSources }) => {
            const args = {syntenyBlock, start, size};
            return dataSources[sourceName].getSyntenicRegions(args);
        },
        dataSets: async (syntenyBlock, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForSyntenyBlock(syntenyBlock, args);
        },
    },
});
