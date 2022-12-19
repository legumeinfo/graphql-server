module.exports = {
    
    Query: {

        gwas: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGWAS(id);
        },

    },

    GWAS: {
        organism: async(gwas, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(gwas.organismId);
        },
        results: async (gwas, { start, size }, { dataSources }) => {
            const args = {
                gwas: gwas,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGWASResults(args);
        },
    },

}
