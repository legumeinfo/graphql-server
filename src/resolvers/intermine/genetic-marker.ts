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
        qtls: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {geneticMarker, start, size};
            return dataSources[sourceName].getQTLs(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        gwasResults: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {geneticMarker, start, size};
            return dataSources[sourceName].getGWASResults(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        linkageGroupPositions: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {geneticMarker, start, size};
            return dataSources[sourceName].getLinkageGroupPositions(geneticMarker, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
