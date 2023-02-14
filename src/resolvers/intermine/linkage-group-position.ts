import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const linkageGroupPositionFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        linkageGroupPosition:  async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroupPosition(id);
        },
    },
    LinkageGroupPosition: {
        linkageGroup: async (linkageGroupPosition, _, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroup(linkageGroupPosition.linkageGroupId);
        },
    },
});
