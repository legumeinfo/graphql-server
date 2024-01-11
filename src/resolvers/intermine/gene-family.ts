import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableInterfaceFactory } from './annotatable-interface.js';

export const geneFamilyFactory = 
    (
        sourceName: KeyOfType<DataSources, IntermineAPI>,
        microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
    ): ResolverMap => ({
    Query: {
        geneFamily: async (_, { identifier }, { dataSources }) => {
            const {data: family} = await dataSources[sourceName].getGeneFamily(identifier);
            if (family == null) {
                const msg = `GeneFamily with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: family};
        },
        geneFamilies: async (_, { description, page, pageSize }, { dataSources }) => {
            const args = {description, page, pageSize};
            return dataSources[sourceName].searchGeneFamilies(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    GeneFamily: {
        ...annotatableInterfaceFactory(sourceName),
        phylotree: async(geneFamily, _, { dataSources }) => {
            return dataSources[sourceName].getPhylotree(geneFamily.phylotreeIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        genes: async (geneFamily, { page, pageSize }, { dataSources }) => {
            const args = {geneFamily:geneFamily, page, pageSize};
            return dataSources[sourceName].getGenes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        proteinDomains: async (geneFamily, { page, pageSize }, { dataSources }) => {
            const args = {geneFamily:geneFamily, page, pageSize};
            return dataSources[sourceName].getProteinDomains(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        tallies: async (geneFamily, { page, pageSize }, { dataSources }) => {
            const args = {geneFamily:geneFamily, page, pageSize};
            return dataSources[sourceName].getGeneFamilyTallies(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        linkouts: async (geneFamily, _, { dataSources }) => {
            const {identifier} = geneFamily;
            return dataSources[microservicesSource].getLinkoutsForGeneFamily(identifier);
        },
    },
});
