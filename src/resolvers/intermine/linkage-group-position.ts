import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const linkageGroupPositionFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        linkageGroupPosition:  async (_, { id }, { dataSources }) => {
            const position = dataSources[sourceName].getLinkageGroupPosition(id);
            if (position == null) {
                const msg = `LinkageGroupPosition with ID '${id}' not found`;
                inputError(msg);
            }
            return position;
        },
    },
    LinkageGroupPosition: {
        linkageGroup: async (linkageGroupPosition, _, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroup(linkageGroupPosition.linkageGroupId);
        },
    },
});
