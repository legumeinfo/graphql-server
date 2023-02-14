import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const gwasResultFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        gwasResult: async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getGWASResult(id);
        },
    },
    GWASResult: {
        gwas: async(gwasResult, _, { dataSources }) => {
            return dataSources[sourceName].getGWAS(gwasResult.gwasId);
        },
        trait: async(gwasResult, _, { dataSources }) => {
            return dataSources[sourceName].getTrait(gwasResult.traitId);
        },
        dataSet: async(gwasResult, _, { dataSources }) => {
            return dataSources[sourceName].getDataSet(gwasResult.dataSetId);
        },
    },
});
