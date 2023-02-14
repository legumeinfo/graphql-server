import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const linkageGroupPositionFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        linkageGroupPosition:  async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroupPosition(id);
        },
    },
    LinkageGroupPosition: {
        linkageGroup: async (linkageGroupPosition, { }, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroup(linkageGroupPosition.linkageGroupId);
        },
    },
});
