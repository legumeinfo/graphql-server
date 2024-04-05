import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';
import { hasGenotypingPlatformFactory } from './genotyping-platform.js';


export const gwasFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        gwas: async (_, { identifier }, { dataSources }) => {
            const {data: gwas} = await dataSources[sourceName].getGWAS(identifier);
            if (gwas == null) {
                const msg = `GWAS with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: gwas};
        },
        gwases: async (_, { description, page, pageSize }, { dataSources }) => {
            const args = {description, page, pageSize};
            return dataSources[sourceName].searchGWASes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    GWAS: {
        ...annotatableFactory(sourceName),
        ...hasGenotypingPlatformFactory(sourceName),
        organism: async(gwas, _, { dataSources }) => {
            const {organismTaxonId} = gwas;
            return dataSources[sourceName].getOrganism(organismTaxonId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        results: async (gwas, { page, pageSize }, { dataSources }) => {
            const args = {gwas, page, pageSize};
            return dataSources[sourceName].getGWASResults(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});


export const hasGWASFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    gwas: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'GWASResult':
            // @ts-ignore: fallthrough case error
            case 'Trait':
                const {gwasIdentifier} = parent;
                request = dataSources[sourceName].getGWAS(gwasIdentifier);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
