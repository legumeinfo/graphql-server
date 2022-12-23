const gwasResultFactory = (sourceName) => ({
    Query: {
        gwasResult: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getGWASResult(id);
        },
    },
    GWASResult: {
        gwas: async(gwasResult, { }, { dataSources }) => {
            const id = gwasResult.gwasId;
            return dataSources[sourceName].getGWAS(id);
        },
        trait: async(gwasResult, { }, { dataSources }) => {
            const id = gwasResult.traitId;
            return dataSources[sourceName].getTrait(id);
        },
    },
});


module.exports = gwasResultFactory;
