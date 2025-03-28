import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { isSequenceFeatureFactory } from './sequence-feature.js';
import { hasTranscriptsFactory } from './transcript.js';

export const exonFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        exon: async (_, { identifier }, { dataSources }) => {
            const {data: exon} = await dataSources[sourceName].getExon(identifier);
            if (exon == null) {
                const msg = `Exon with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: exon};
        },
    },
    Exon: {
        ...isSequenceFeatureFactory(sourceName),
        ...hasTranscriptsFactory(sourceName),
    },
});
