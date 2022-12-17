module.exports = {
    
    Query: {

        proteinDomain: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getProteinDomain(id);
        }, 

    },

    ProteinDomain: {
        genes: async (proteinDomain, { start, size }, { dataSources }) => {
            const args = {
                proteinDomain: proteinDomain,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGenes(args);
        },
        geneFamilies: async (proteinDomain, { start, size }, { dataSources }) => {
            const args = {
                proteinDomain: proteinDomain,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGeneFamilies(args);
        },
    },

}
