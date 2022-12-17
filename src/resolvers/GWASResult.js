module.exports = {
    
    Query: {

        gwasResult: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGWASResult(id);
        },

    },

    GWASResult: {
        gwas: async(gwasResult, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGWAS(gwasResult.gwasId);
        },
        trait: async(gwasResult, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getTrait(gwasResult.traitId);
        },
    },

}
