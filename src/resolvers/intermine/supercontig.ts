import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { isSequenceFeatureFactory } from './sequence-feature.js';


export const supercontigFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        supercontig: async (_, { identifier }, { dataSources }) => {
            const {data: supercontig} = await dataSources[sourceName].getSupercontig(identifier);
            if (supercontig == null) {
                const msg = `Supercontig with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: supercontig};
        },
    },
    Supercontig: {
        ...isSequenceFeatureFactory(sourceName),
    },
});
