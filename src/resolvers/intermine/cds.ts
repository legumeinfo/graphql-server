import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureInterfaceFactory } from './sequence-feature-interface.js';

export const cdsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        cds: async (_, { identifier }, { dataSources }) => {
            const {data: cds} = await dataSources[sourceName].getCDS(identifier);
            if (cds == null) {
                const msg = `CDS with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: cds};
        },
    },
    CDS: {
        ...sequenceFeatureInterfaceFactory(sourceName),
        transcript: async(cds, _, { dataSources }) => {
            return dataSources[sourceName].getTranscript(cds.transcriptIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
