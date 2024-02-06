import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';

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
        geneticMaps: async (_, { description, page, pageSize }, { dataSources }) => {
            const args = {description, page, pageSize};
            return dataSources[sourceName].searchGeneticMaps(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    GeneticMap: {
        ...annotatableFactory(sourceName),
        organism: async (geneticMap, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(geneticMap.organismTaxonId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genotypingPlatform: async (geneticMap, _, { dataSources }) => {
            return dataSources[sourceName].getGenotypingPlatform(geneticMap.genotypingPlatformIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        linkageGroups: async (geneticMap, { page, pageSize }, { dataSources }) => {
            const { id } = geneticMap;
            return dataSources[sourceName].getLinkageGroupsForGeneticMap(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
