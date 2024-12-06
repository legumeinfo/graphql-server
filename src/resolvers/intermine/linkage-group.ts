import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
import { isAnnotatableFactory } from './annotatable.js';
import { hasQTLsFactory } from './qtl.js';


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
        ...isAnnotatableFactory(sourceName),
        ...hasQTLsFactory(sourceName),
        geneticMap: async (linkageGroup, _, { dataSources }) => {
            return dataSources[sourceName].getGeneticMap(linkageGroup.geneticMapId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});


export const hasLinkageGroupFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    linkageGroup: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'LinkageGroupPosition':
            case 'QTL':
                const {linkageGroupIdentifier} = parent;
                request = dataSources[sourceName].getLinkageGroup(linkageGroupIdentifier);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
