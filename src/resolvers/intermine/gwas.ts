import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const gwasFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        gwas: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getGWAS(id);
        },
        gwases: async (_source, { description, start, size }, { dataSources }) => {
            const args = {description, start, size};
            return dataSources[sourceName].searchGWASes(args);
        },
    },
    GWAS: {
        organism: async(gwas, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(gwas.organismId);
        },
        dataSet: async(gwas, { }, { dataSources }) => {
            return dataSources[sourceName].getDataSet(gwas.dataSetId);
        },
        results: async (gwas, { }, { dataSources }) => {
            const args = {gwas};
            return dataSources[sourceName].getGWASResults(args);
        },
        publications: async (gwas, { start, size }, { dataSources }) => {
            const args = {annotatable: gwas, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    },
});
