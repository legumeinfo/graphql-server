import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const gwasResultFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        gwasResult: async (_, { identifier }, { dataSources }) => {
            return dataSources[sourceName].getGWASResult(identifier);
        },
    },
    GWASResult: {
        gwas: async(gwasResult, _, { dataSources }) => {
            return dataSources[sourceName].getGWAS(gwasResult.gwasIdentifier);
        },
        trait: async(gwasResult, _, { dataSources }) => {
            return dataSources[sourceName].getTrait(gwasResult.traitIdentifier);
        },
        dataSet: async(gwasResult, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(gwasResult.dataSetName);
        },
        publications: async (gwasResult, { start, size }, { dataSources }) => {
            const args = {annotatable: gwasResult, start, size};
            return dataSources[sourceName].getPublications(args);
        },
    },
});
