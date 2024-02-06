import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureFactory } from './sequence-feature.js';

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
        transcripts: async (utr, { page, pageSize }, { dataSources }) => {
            const { id } = utr;
            return dataSources[sourceName].getTranscriptsForUTR(id, {page, pageSize})
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
