import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const mineWebPropertiesFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        mineWebProperties: async (_, __, { dataSources }) => {
            return dataSources[sourceName].getMineWebProperties();
        },
    },
});
