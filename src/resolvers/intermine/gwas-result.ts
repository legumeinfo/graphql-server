import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const gwasResultFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        gwasResult: async (_, { id }, { dataSources }) => {
            const result = await dataSources[sourceName].getGWASResult(id);
            if (result == null) {
                const msg = `GWASResult with ID '${id}' not found`;
                inputError(msg);
            }
            return result;
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
