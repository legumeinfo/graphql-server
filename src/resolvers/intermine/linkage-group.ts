import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';

export const linkageGroupFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        linkageGroup: async (_, { identifier }, { dataSources }) => {
            const {data: group} = await dataSources[sourceName].getLinkageGroup(identifier);
            if (group == null) {
                const msg = `LinkageGroup with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: group};
        },
    },
    LinkageGroup: {
        ...annotatableFactory(sourceName),
        geneticMap: async (linkageGroup, _, { dataSources }) => {
            return dataSources[sourceName].getGeneticMap(linkageGroup.geneticMapIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        qtls: async (linkageGroup, { page, pageSize }, { dataSources }) => {
            const { id } = linkageGroup;
            return dataSources[sourceName].getQTLsForLinkageGroup(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
