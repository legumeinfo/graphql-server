import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const linkageGroupPositionFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        linkageGroupPosition: async (_, { id }, { dataSources }) => {
            const {data: position} = await dataSources[sourceName].getLinkageGroupPosition(id);
            if (position == null) {
                const msg = `LinkageGroupPosition with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: position};
        },
    },
    LinkageGroupPosition: {
        linkageGroup: async (linkageGroupPosition, _, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroup(linkageGroupPosition.linkageGroupId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
