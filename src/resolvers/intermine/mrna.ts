import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { transcriptInterfaceFactory } from './transcript-interface.js';

export const mRNAFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        mRNA: async (_, { identifier }, { dataSources }) => {
            const {data: mrna} = await dataSources[sourceName].getMRNA(identifier);
            if (mrna == null) {
                const msg = `mRNA with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: mrna};
        },
    },
    MRNA: {
        ...transcriptInterfaceFactory(sourceName),
    },
});
