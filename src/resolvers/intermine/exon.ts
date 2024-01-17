import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureInterfaceFactory } from './sequence-feature-interface.js';

export const exonFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        exon: async (_, { identifier }, { dataSources }) => {
            const {data: exon} = await dataSources[sourceName].getExon(identifier);
            if (exon == null) {
                const msg = `Exon with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: exon};
        },
    },
    Exon: {
        ...sequenceFeatureInterfaceFactory(sourceName),
        transcripts: async (exon, { page, pageSize }, { dataSources }) => {
            const args = {exon, page, pageSize};
            return dataSources[sourceName].getTranscripts(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
