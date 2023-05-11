import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const syntenicRegionFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        syntenicRegion: async (_, { identifier }, { dataSources }) => {
            const region = await dataSources[sourceName].getSyntenicRegion(identifier);
            if (region == null) {
                const msg = `SyntenicRegion with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return region;
        },
    },
    SyntenicRegion: {
        organism: async (syntenicRegion, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(syntenicRegion.organismTaxonId);
        },
        strain: async (syntenicRegion, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(syntenicRegion.strainIdentifier);
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
