import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureFactory } from './sequence-feature.js';
import { hasTranscriptsFactory } from './transcript.js';

export const utrFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        utr: async (_, { identifier }, { dataSources }) => {
            const {data: utr} = await dataSources[sourceName].getUTR(identifier);
            if (utr == null) {
                const msg = `UTR with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: utr};
        },
    },
    UTR: {
        ...sequenceFeatureFactory(sourceName),
        ...hasTranscriptsFactory(sourceName),
    },
});
