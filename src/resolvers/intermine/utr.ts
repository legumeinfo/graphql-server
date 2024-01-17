import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureInterfaceFactory } from './sequence-feature-interface.js';

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
        ...sequenceFeatureInterfaceFactory(sourceName),
        transcripts: async (utr, { page, pageSize }, { dataSources }) => {
            const args = {utr, page, pageSize};
            return dataSources[sourceName].getTranscripts(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
