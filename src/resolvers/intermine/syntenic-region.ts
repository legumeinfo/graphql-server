import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const syntenicRegionFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        syntenicRegion: async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getSyntenicRegion(id);
        },
    },
    SyntenicRegion: {
        organism: async (syntenicRegion, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(syntenicRegion.organismId);
        },
        strain: async (syntenicRegion, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(syntenicRegion.strainId);
        },
        syntenyBlock: async (syntenicRegion, _, { dataSources }) => {
            return dataSources[sourceName].getSyntenyBlock(syntenicRegion.syntenyBlockId);
        },
        dataSets: async (syntenicRegion, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(syntenicRegion, args);
        },
        locations: async (syntenicRegion, _, { dataSources }) => {
            const args = {sequenceFeature: syntenicRegion};
            return dataSources[sourceName].getLocations(args);
        },
    },
});
