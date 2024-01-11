import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureInterfaceFactory } from './sequence-feature-interface.js';

// for INTERNAL resolution of SequenceFeature references and collections
export const sequenceFeatureFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        sequenceFeature: async (_, { id }, { dataSources }) => {
            const {data: sequenceFeature} = await dataSources[sourceName].getSequenceFeature(id);
            if (sequenceFeature == null) {
                const msg = `SequenceFeature with id '${id}' not found`;
                inputError(msg);
            }
            return {results: sequenceFeature};
        },
    },
    SequenceFeature: {
        ...sequenceFeatureInterfaceFactory(sourceName),
    },
});
