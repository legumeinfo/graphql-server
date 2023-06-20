import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const geneticMapFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        geneticMap: async (_, { identifier }, { dataSources }) => {
            const {data: map} = await dataSources[sourceName].getGeneticMap(identifier);
            if (map == null) {
                const msg = `GeneticMap with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: map};
        },
        geneticMaps: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchGeneticMaps(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    GeneticMap: {
        organism: async (geneticMap, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(geneticMap.organismTaxonId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSets: async (geneticMap, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForGeneticMap(geneticMap, args);
        },
        linkageGroups: async (geneticMap, { start, size }, { dataSources }) => {
            const args = {geneticMap, start, size};
            return dataSources[sourceName].getLinkageGroups(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        publications: async (geneticMap, { start, size }, { dataSources }) => {
            const args = {annotatable: geneticMap, start, size};
            return dataSources[sourceName].getPublications(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
