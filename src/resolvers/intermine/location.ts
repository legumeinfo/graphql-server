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
                const {data: location} = await dataSources[sourceName].getLocation(id);
                if (location == null) {
                    const msg = `Location with ID '${id}' not found`;
                    inputError(msg);
                }
                return {results: location};
            },
        },
        Location: {
            feature: async (location, _, { dataSources }) => {
                return dataSources[sourceName].getBioEntity(location.featureIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            dataSets: async (location, { page, pageSize }, { dataSources }) => {
                const args = {bioEntity: location, page, pageSize};
                return dataSources[sourceName].getDataSets(args)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            // locatedOn breakout:
            chromosome: async (location, _, { dataSources }) => {
                return dataSources[sourceName].getChromosome(location.locatedOnIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            supercontig: async (location, _, { dataSources }) => {
                return dataSources[sourceName].getSupercontig(location.locatedOnIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            protein: async (location, _, { dataSources }) => {
                return dataSources[sourceName].getProtein(location.locatedOnIdentifier)
                // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            // microservices
            linkouts: async (location, _, { dataSources }) => {
                const {locatedOnIdentifier, start, end} = location;
                return dataSources[microservicesSource].getLinkoutsForLocation(locatedOnIdentifier, start, end);
            },
        },
    });
