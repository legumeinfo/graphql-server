import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const chromosomeFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        chromosome: async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getChromosome(id);
        },
        // chromosomes: async (_, { description, start, size }, { dataSources }) => {
        //     const args = {description, start, size};
        //     return dataSources[sourceName].searchChromosomes(args);
        // },
    },
    Chromosome: {
        organism: async (chromosome, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(chromosome.organismId);
        },
        strain: async (chromosome, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(chromosome.strainId);
        },
        dataSets: async (chromosome, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(chromosome, args);
        },
    },
});
