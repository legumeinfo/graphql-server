import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const locationFactory =
(
    sourceName: KeyOfType<DataSources, IntermineAPI>,
    microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
): ResolverMap => ({
    Query: {
        location: async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getLocation(id);
        },
    },
    Location: {
        chromosome: async (location, _, { dataSources }) => {
            return dataSources[sourceName].getChromosome(location.locatedOnIdentifier);
        },
        supercontig: async (location, _, { dataSources }) => {
            return dataSources[sourceName].getSupercontig(location.locatedOnIdentifier);
        },
        
        dataSets: async (location, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForLocation(location, args);
        },
        linkouts: async (location, _, { dataSources }) => {
          const {locatedOnIdentifier, start, end} = location;
          return dataSources[microservicesSource].getLinkoutsForLocation(locatedOnIdentifier, start, end);
        },
    },
});
