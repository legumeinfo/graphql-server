import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const syntenicRegionFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        syntenicRegion: async (_, { identifier }, { dataSources }) => {
            const {data: region} = await dataSources[sourceName].getSyntenicRegion(identifier);
            if (region == null) {
                const msg = `SyntenicRegion with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: region};
        },
    },
    SyntenicRegion: {
        organism: async (syntenicRegion, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(syntenicRegion.organismTaxonId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        strain: async (syntenicRegion, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(syntenicRegion.strainIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);;
        },
        syntenyBlock: async (syntenicRegion, _, { dataSources }) => {
            return dataSources[sourceName].getSyntenyBlock(syntenicRegion.syntenyBlockId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSets: async (syntenicRegion, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(syntenicRegion, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        locations: async (syntenicRegion, { start, size }, { dataSources }) => {
            const args = {sequenceFeature: syntenicRegion, start, size};
            return dataSources[sourceName].getLocations(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
