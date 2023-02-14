import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const locationFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        location: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getLocation(id);
        },
    },
    Location: {
        chromosome: async (location, { }, { dataSources }) => {
            return dataSources[sourceName].getChromosome(location.chromosomeId);
        },
        dataSets: async (location, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForLocation(location, args);
        },
    },
});
