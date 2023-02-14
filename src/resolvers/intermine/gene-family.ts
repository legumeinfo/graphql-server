import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFamilyFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        geneFamily: async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(id);
        },
        geneFamilies: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
         return dataSources[sourceName].searchGeneFamilies(args);
        },
    },
    GeneFamily: {
        phylotree: async(geneFamily, _, { dataSources }) => {
            return dataSources[sourceName].getPhylotree(geneFamily.phylotreeId);
        },
        genes: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {geneFamily, start, size};
            return dataSources[sourceName].getGenes(args);
        },
        proteinDomains: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {geneFamily, start, size};
            return dataSources[sourceName].getProteinDomains(args);
        },
        tallies: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {geneFamily, start, size};
            return dataSources[sourceName].getGeneFamilyTallies(args);
        },
        ontologyAnnotations: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {annotatable: geneFamily, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args);
        },
    },
});
