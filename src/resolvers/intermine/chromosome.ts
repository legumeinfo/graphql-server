import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { isSequenceFeatureFactory } from './sequence-feature.js';


export const chromosomeFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        chromosome: async (_, { identifier }, { dataSources }) => {
            const {data: chromosome} = await dataSources[sourceName].getChromosome(identifier);
            if (chromosome == null) {
                const msg = `Chromosome with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: chromosome};
        },
    },
    Chromosome: {
        ...isSequenceFeatureFactory(sourceName),
    },
});
