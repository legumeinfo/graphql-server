import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const gwasFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        gwas: async (_, { identifier }, { dataSources }) => {
            const gwas = await dataSources[sourceName].getGWAS(identifier);
            if (gwas == null) {
                const msg = `GWAS with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return gwas;
        },
        gwases: async (_, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchGWASes(args)
                // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    GWAS: {
        organism: async(gwas, _, { dataSources }) => {
            return dataSources[sourceName].getOrganism(gwas.organismTaxonId);
        },
        dataSet: async(gwas, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(gwas.dataSetName);
        },
        results: async (gwas, _, { dataSources }) => {
            const args = {gwas};
            return dataSources[sourceName].getGWASResults(args);
        },
        publications: async (gwas, { start, size }, { dataSources }) => {
            const args = {annotatable: gwas, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    },
});
