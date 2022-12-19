module.exports = {
    
    Query: {

        protein: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getProtein(id);
        }, 

    },

    Protein: {
        organism: async(protein, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(protein.organismId);
        },
        strain: async(protein, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getStrain(protein.strainId);
        },
        genes: async (protein, { start, size }, { dataSources }) => {
            const args = {
                protein: protein,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGenes(args);
        },
        geneFamilyAssignments: async (protein, { start, size }, { dataSources }) => {
            const args = {
                protein: protein,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGeneFamilyAssignments(args);
        },
    },

}
