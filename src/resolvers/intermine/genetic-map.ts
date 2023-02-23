import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const geneticMapFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        geneticMap:  async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getGeneticMap(identifier);
        },
        geneticMaps: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchGeneticMaps(args);
        },
    },
    GeneticMap: {
        organism: async (geneticMap, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(geneticMap.organismTaxonId);
        },
        dataSets: async (geneticMap, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForGeneticMap(geneticMap, args);
        },
        linkageGroups: async (geneticMap, _, { dataSources }) => {
            const args = {geneticMap};
            return dataSources[sourceName].getLinkageGroups(args);
        },
        publications: async (geneticMap, { start, size }, { dataSources }) => {
            const args = {annotatable: geneticMap, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    },
});
