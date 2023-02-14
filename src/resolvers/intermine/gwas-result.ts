import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const gwasResultFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        gwasResult: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getGWASResult(id);
        },
    },
    GWASResult: {
        gwas: async(gwasResult, { }, { dataSources }) => {
            return dataSources[sourceName].getGWAS(gwasResult.gwasId);
        },
        trait: async(gwasResult, { }, { dataSources }) => {
            return dataSources[sourceName].getTrait(gwasResult.traitId);
        },
        dataSet: async(gwasResult, { }, { dataSources }) => {
            return dataSources[sourceName].getDataSet(gwasResult.dataSetId);
        },
    },
});
