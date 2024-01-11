import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableInterfaceFactory } from './annotatable-interface.js';

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
        ...annotatableInterfaceFactory(sourceName),
        geneticMap: async (linkageGroup, _, { dataSources }) => {
            return dataSources[sourceName].getGeneticMap(linkageGroup.geneticMapId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSets: async (linkageGroup, { page, pageSize }, { dataSources }) => {
            const args = {bioEntity: linkageGroup, page, pageSize};
            return dataSources[sourceName].getDataSets(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        qtls: async (linkageGroup, { page, pageSize }, { dataSources }) => {
            const args = {linkageGroup, page, pageSize};
            return dataSources[sourceName].getQTLs(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
