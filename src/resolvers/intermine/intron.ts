import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureFactory } from './sequence-feature.js';
import { hasTranscriptsFactory } from './transcript.js';

export const intronFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        intron: async (_, { identifier }, { dataSources }) => {
            const {data: intron} = await dataSources[sourceName].getIntron(identifier);
            if (intron == null) {
                const msg = `Intron with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: intron};
        },
    },
    Intron: {
        ...sequenceFeatureFactory(sourceName),
        ...hasTranscriptsFactory(sourceName),
        genes: async (intron, { page, pageSize }, { dataSources }) => {
            const {id} = intron;
            const args = {page, pageSize};
            return dataSources[sourceName].getGenesForIntron(id, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        }
    },
});
