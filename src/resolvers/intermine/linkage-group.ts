import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const linkageGroupFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        linkageGroup:  async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroup(identifier);
        },
    },
    LinkageGroup: {
        geneticMap: async (linkageGroup, _, { dataSources }) => {
            return dataSources[sourceName].getGeneticMap(linkageGroup.geneticMapId);
        },
        dataSets: async (linkageGroup, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForLinkageGroup(linkageGroup, args);
        },
        qtls: async (linkageGroup, _, { dataSources }) => {
            const args = {linkageGroup};
            return dataSources[sourceName].getQTLs(args);
        },
        publications: async (linkageGroup, { start, size }, { dataSources }) => {
            const args = {annotatable: linkageGroup, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    },
});
