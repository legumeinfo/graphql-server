import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureFactory } from './sequence-feature.js';

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
        ...sequenceFeatureFactory(sourceName),
        transcripts: async (exon, { page, pageSize }, { dataSources }) => {
            const { id } = exon;
            return dataSources[sourceName].getTranscriptsForExon(id, {page, pageSize})
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
