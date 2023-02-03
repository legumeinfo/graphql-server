export const gwasResultFactory = (sourceName) => ({
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
