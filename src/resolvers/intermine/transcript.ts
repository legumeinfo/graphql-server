import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { transcriptInterfaceFactory } from './transcript-interface.js';

export const transcriptFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        transcript: async (_, { identifier }, { dataSources }) => {
            const {data: transcript} = await dataSources[sourceName].getTranscript(identifier);
            if (transcript == null) {
                const msg = `Transcript with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: transcript};
        },
    },
    Transcript: {
        ...transcriptInterfaceFactory(sourceName),
    },
});
