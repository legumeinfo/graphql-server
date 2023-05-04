import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const gwasResultFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        gwasResult: async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getGWASResult(id);
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
    },
});
