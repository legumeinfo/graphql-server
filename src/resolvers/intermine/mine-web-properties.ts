import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const mineWebPropertiesFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        mineWebProperties: async (_, __, { dataSources }) => {
            return dataSources[sourceName].getMineWebProperties();
        },
    },
});
