import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const locationFactory =
(
    sourceName: KeyOfType<DataSources, IntermineAPI>,
    microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
): ResolverMap => ({
    Query: {
        location: async (_, { id }, { dataSources }) => {
            const location = await dataSources[sourceName].getLocation(id);
            if (location == null) {
                const msg = `Location with ID '${id}' not found`;
                inputError(msg);
            }
            return location;
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
