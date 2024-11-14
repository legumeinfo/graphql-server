import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { hasDataSetsFactory } from './data-set.js';


export const locationFactory =
(
    sourceName: KeyOfType<DataSources, IntermineAPI>,
    microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
): ResolverMap => ({
    Query: {
        location: async (_, { id }, { dataSources }) => {
            const {data: location} = await dataSources[sourceName].getLocation(id);
            if (location == null) {
                const msg = `Location with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: location};
        },
    },
    Location: {
        ...hasDataSetsFactory(sourceName),
        locatedOn: async (location, _, { dataSources }) => {
            const {locatedOnClass, locatedOnIdentifier} = location;
            switch (locatedOnClass) {
                case "Chromosome":
                    return dataSources[sourceName].getChromosome(locatedOnIdentifier)
                        // @ts-ignore: implicit type any error
                        .then(({data: results}) => {
                            return {__typename: locatedOnClass, ...results};
                        });
                case "Supercontig":
                    return dataSources[sourceName].getSupercontig(locatedOnIdentifier)
                        // @ts-ignore: implicit type any error
                        .then(({data: results}) => {
                            return {__typename: locatedOnClass, ...results};
                        });
            }
            return null;
        },
        linkouts: async (location, _, { dataSources }) => {
          const {locatedOnIdentifier, start, end} = location;
          return dataSources[microservicesSource].getLinkoutsForLocation(locatedOnIdentifier, start, end);
        },
    },
});
