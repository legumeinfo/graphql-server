import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';

export const sequenceFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        sequence: async (_, { id }, { dataSources }) => {
            const {data: sequence} = await dataSources[sourceName].getSequence(id);
            if (sequence == null) {
                const msg = `Sequence with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: sequence};
        },
    },
});
