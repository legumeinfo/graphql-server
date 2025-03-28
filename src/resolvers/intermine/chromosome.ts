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
                const msg = `Chromosome with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: chromosome};
        },
        chromosomes: async (_, { genus, species, strain, assembly, annotation, page, pageSize }, { dataSources }) => {
            const args = {genus, species, strain, assembly, annotation, page, pageSize};
            return dataSources[sourceName].getChromosomes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    Chromosome: {
        ...isSequenceFeatureFactory(sourceName),
    },
});
