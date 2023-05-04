import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const chromosomeFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        chromosome: async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getChromosome(identifier);
        },
    },
    Chromosome: {
        organism: async (chromosome, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(chromosome.organismTaxonId);
        },
        strain: async (chromosome, _, { dataSources }) => {
            return dataSources[sourceName].getStrain(chromosome.strainIdentifier);
        },
        dataSets: async (chromosome, { start, size }, { dataSources }) => {
            const args = {start, size};
            return dataSources[sourceName].getDataSetsForBioEntity(chromosome, args);
        },
    },
});
