import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureFactory } from './sequence-feature.js';

export const geneticMarkerFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        geneticMarker: async (_, { identifier }, { dataSources }) => {
            const {data: marker} = await dataSources[sourceName].getGeneticMarker(identifier);
            if (marker == null) {
                const msg = `GeneticMarker with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: marker};
        },
    },
    GeneticMarker: {
        ...sequenceFeatureFactory(sourceName),
        qtls: async (geneticMarker, { page, pageSize }, { dataSources }) => {
            const { id } = geneticMarker;
            return dataSources[sourceName].getQTLsForGeneticMarker(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genotypingPlatforms: async (geneticMarker, { page, pageSize }, { dataSources }) => {
            const { id } = geneticMarker;
            return dataSources[sourceName].getGenotypingPlatformsForGeneticMarker(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        gwasResults: async (geneticMarker, { page, pageSize }, { dataSources }) => {
            const { id } = geneticMarker;
            return dataSources[sourceName].getGWASResultsForGeneticMarker(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        linkageGroupPositions: async (geneticMarker, { page, pageSize }, { dataSources }) => {
            const { id } = geneticMarker;
            return dataSources[sourceName].getLinkageGroupPositionsForGeneticMarker(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
