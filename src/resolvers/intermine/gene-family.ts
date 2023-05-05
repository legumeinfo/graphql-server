import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFamilyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        geneFamily: async (_, { identifier }, { dataSources }) => {
            const family = dataSources[sourceName].getGeneFamily(identifier);
            if (family == null) {
                const msg = `GeneFamily with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return family;
        },
        geneFamilies: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
         return dataSources[sourceName].searchGeneFamilies(args);
        },
    },
    GeneFamily: {
        phylotree: async(geneFamily, _, { dataSources }) => {
            return dataSources[sourceName].getPhylotree(geneFamily.phylotreeIdentifier);
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
