import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureInterfaceFactory } from './sequence-feature-interface.js';

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
        ...sequenceFeatureInterfaceFactory(sourceName),
    },
});
