import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';

export const proteinDomainFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        proteinDomain: async (_, { identifier }, { dataSources }) => {
            const {data: domain} = await dataSources[sourceName].getProteinDomain(identifier);
            if (domain == null) {
                const msg = `ProteinDomain with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: domain};
        },
        proteinDomains: async (_, { description, page, pageSize }, { dataSources }) => {
            const args = {description, page, pageSize};
            return dataSources[sourceName].searchProteinDomains(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    ProteinDomain: {
        ...annotatableFactory(sourceName),
        genes: async (proteinDomain, { page, pageSize }, { dataSources }) => {
            const args = {proteinDomain, page, pageSize};
            return dataSources[sourceName].getGenes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        geneFamilies: async (proteinDomain, { page, pageSize }, { dataSources }) => {
            const args = {proteinDomain, page, pageSize};
            return dataSources[sourceName].getGeneFamilies(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        childFeatures: async (proteinDomain, { page, pageSize }, { dataSources }) => {
            const args = {proteinDomain, page, pageSize};
            return dataSources[sourceName].getProteinDomainChildFeatures(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        parentFeatures: async (proteinDomain, { page, pageSize }, { dataSources }) => {
            const args = {proteinDomain, page, pageSize};
            return dataSources[sourceName].getProteinDomainParentFeatures(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
