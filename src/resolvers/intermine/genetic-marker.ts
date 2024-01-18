import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureInterfaceFactory } from './sequence-feature-interface.js';

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
        ...sequenceFeatureInterfaceFactory(sourceName),
        qtls: async (geneticMarker, { page, pageSize }, { dataSources }) => {
            const args = {geneticMarker, page, pageSize};
            return dataSources[sourceName].getQTLs(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genotypingPlatforms: async (geneticMarker, { page, pageSize }, { dataSources }) => {
            const args = {geneticMarker, page, pageSize};
            return dataSources[sourceName].getGenotypingPlatforms(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        gwasResults: async (geneticMarker, { page, pageSize }, { dataSources }) => {
            const args = {geneticMarker, page, pageSize};
            return dataSources[sourceName].getGWASResults(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        linkageGroupPositions: async (geneticMarker, { page, pageSize }, { dataSources }) => {
            const args = {geneticMarker, page, pageSize};
            return dataSources[sourceName].getLinkageGroupPositions(geneticMarker, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
