import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const mineWebPropertiesFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        mineWebProperties: async (_source, { }, { dataSources }) => {
            return dataSources[sourceName].getMineWebProperties();
        },
    },
});
