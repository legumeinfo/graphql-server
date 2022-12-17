module.exports = {
    
    Query: {

        strain: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getStrain(id);
        },

        // strains: async (_source, { organismId }, { dataSources }) => {
        //     return dataSources.lisIntermineAPI.getStrains(organismId);
        // },

    },

    Strain: {
        organism: async (strain, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(strain.organismId);
        },
    },

}
