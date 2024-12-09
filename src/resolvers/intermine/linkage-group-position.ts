import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { hasLinkageGroupFactory } from './linkage-group.js';


export const linkageGroupPositionFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        //linkageGroupPosition: async (_, { id }, { dataSources }) => {
        //    const {data: position} = await dataSources[sourceName].getLinkageGroupPosition(id);
        //    if (position == null) {
        //        const msg = `LinkageGroupPosition with ID '${id}' not found`;
        //        inputError(msg);
        //    }
        //    return {results: position};
        //},
    },
    LinkageGroupPosition: {
        ...hasLinkageGroupFactory(sourceName),
    },
});
