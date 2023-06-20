import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


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
        organism: async (geneticMarker, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(geneticMarker.organismTaxonId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        strain: async (geneticMarker, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(geneticMarker.strainIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSets: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(geneticMarker, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
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
        locations: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {sequenceFeature: geneticMarker, start, size};
            return dataSources[sourceName].getLocations(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
