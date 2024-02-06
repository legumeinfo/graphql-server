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
            const { id } = proteinDomain;
            return dataSources[sourceName].getGenesForProteinDomain(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        geneFamilies: async (proteinDomain, { page, pageSize }, { dataSources }) => {
            const { id } = proteinDomain;
            return dataSources[sourceName].getGeneFamiliesForProteinDomain(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        childFeatures: async (proteinDomain, { page, pageSize }, { dataSources }) => {
            const { id } = proteinDomain;
            return dataSources[sourceName].getChildFeaturesForProteinDomain(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        parentFeatures: async (proteinDomain, { page, pageSize }, { dataSources }) => {
            const { id } = proteinDomain;
            return dataSources[sourceName].getParentFeaturesForProteinDomain(id, {page, pageSize})
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
