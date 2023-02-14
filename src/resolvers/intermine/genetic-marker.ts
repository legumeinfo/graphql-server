import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const geneticMarkerFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        geneticMarker:  async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getGeneticMarker(id);
        },
        // geneticMarkers: async (_, { description, start, size }, { dataSources }) => {
        //     const args = {description, start, size};
        //     return dataSources[sourceName].searchGeneticMarkers(args);
        // },
    },
    GeneticMarker: {
        organism: async (geneticMarker, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(geneticMarker.organismId);
        },
        strain: async (geneticMarker, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(geneticMarker.strainId);
        },
        dataSets: async (geneticMarker, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(geneticMarker, args);
        },
        qtls: async (geneticMarker, _, { dataSources }) => {
            const args = {geneticMarker};
            return dataSources[sourceName].getQTLs(args);
        },
        gwasResults: async (geneticMarker, _, { dataSources }) => {
            const args = {geneticMarker};
            return dataSources[sourceName].getGWASResults(args);
        },
        linkageGroupPositions: async (geneticMarker, _, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroupPositions(geneticMarker);
        },
        locations: async (geneticMarker, _, { dataSources }) => {
            const args = {sequenceFeature: geneticMarker};
            return dataSources[sourceName].getLocations(args);
        },
    },
});
