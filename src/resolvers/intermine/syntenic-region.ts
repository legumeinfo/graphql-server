import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { isSequenceFeatureFactory } from './sequence-feature.js';


export const syntenicRegionFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        syntenicRegion: async (_, { identifier }, { dataSources }) => {
            const {data: region} = await dataSources[sourceName].getSyntenicRegion(identifier);
            if (region == null) {
                const msg = `SyntenicRegion with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: region};
        },
    },
    SyntenicRegion: {
        ...isSequenceFeatureFactory(sourceName),
        syntenyBlock: async (syntenicRegion, _, { dataSources }) => {
            const {syntenyBlockIdentifier} = syntenicRegion;
            return dataSources[sourceName].getSyntenyBlock(syntenyBlockIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
