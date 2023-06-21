import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const geneFamilyFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        geneFamily: async (_, { identifier }, { dataSources }) => {
            const {data: family} = await dataSources[sourceName].getGeneFamily(identifier);
            if (family == null) {
                const msg = `GeneFamily with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: family};
        },
        geneFamilies: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchGeneFamilies(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    GeneFamily: {
        phylotree: async(geneFamily, _, { dataSources }) => {
            // phylotrees have the same identifier as their corresponding gene family
            return dataSources[sourceName].getPhylotree(geneFamily.identifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genes: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {geneFamily, start, size};
            return dataSources[sourceName].getGenes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        proteinDomains: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {geneFamily, start, size};
            return dataSources[sourceName].getProteinDomains(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        tallies: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {geneFamily, start, size};
            return dataSources[sourceName].getGeneFamilyTallies(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        ontologyAnnotations: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {annotatable: geneFamily, start, size};
            return dataSources[sourceName].getOntologyAnnotations(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
