import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { hasDataSetsFactory } from './data-set.js';

// Note: Location does not have a string identifier so we query on id.
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
                return dataSources[sourceName].getBioEntity(location.locatedOnId)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            feature: async (location, _, { dataSources }) => {
                return dataSources[sourceName].getBioEntity(location.featureId)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            // microservices
            linkouts: async (location, _, { dataSources }) => {
                return dataSources[microservicesSource].getLinkouts({location});
            },
        },
    });
