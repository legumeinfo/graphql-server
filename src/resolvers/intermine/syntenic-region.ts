import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureInterfaceFactory } from './sequence-feature-interface.js';

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
        ...sequenceFeatureInterfaceFactory(sourceName),
        syntenyBlock: async (syntenicRegion, _, { dataSources }) => {
            return dataSources[sourceName].getSyntenyBlock(syntenicRegion.syntenyBlockId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
