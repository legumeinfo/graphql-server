import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const syntenyBlockFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
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
