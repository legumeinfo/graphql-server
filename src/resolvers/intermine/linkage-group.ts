import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const linkageGroupFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        linkageGroup: async (_, { id }, { dataSources }) => {
            const {data: group} = await dataSources[sourceName].getLinkageGroup(id);
            if (group == null) {
                const msg = `LinkageGroup with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: group};
        },
    },
    LinkageGroup: {
        geneticMap: async (linkageGroup, _, { dataSources }) => {
            return dataSources[sourceName].getGeneticMap(linkageGroup.geneticMapId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSets: async (linkageGroup, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForLinkageGroup(linkageGroup, args);
        },
        qtls: async (linkageGroup, { start, size }, { dataSources }) => {
            const args = {linkageGroup, start, size};
            return dataSources[sourceName].getQTLs(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
