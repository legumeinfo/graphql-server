import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';


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
        organism: async(gwas, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(gwas.organismTaxonId)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSet: async(gwas, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(gwas.dataSetName)
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
