import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const geneticMapFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        geneticMap:  async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getGeneticMap(id);
        },
        geneticMaps: async (_source, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchGeneticMaps(args);
        },
    },
    GeneticMap: {
        organism: async (geneticMap, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(geneticMap.organismId);
        },
        dataSets: async (geneticMap, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForGeneticMap(geneticMap, args);
        },
        linkageGroups: async (geneticMap, { }, { dataSources }) => {
            const args = {geneticMap};
            return dataSources[sourceName].getLinkageGroups(args);
        },
        publications: async (geneticMap, { start, size }, { dataSources }) => {
            const args = {annotatable: geneticMap, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    },
});