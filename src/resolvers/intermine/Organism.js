module.exports = {
    
    Query: {

        organism: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(id);
        },

        // organisms: async (_source, { genus, start, size }, { dataSources }) => {
        //     const args = {
        //         genus,
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.getOrganisms(args);
        // },
        
    },

    Organism: {
        strains: async (organism, { start, size }, { dataSources }) => {
            const args = {
                organism: organism,
                start,
                size,
            }
            return dataSources.lisIntermineAPI.getStrains(args);
        },
    },

}
