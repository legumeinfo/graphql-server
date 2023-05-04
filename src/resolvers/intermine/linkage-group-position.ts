import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const linkageGroupPositionFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
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
