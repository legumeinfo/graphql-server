module.exports = {
    
    Query: {
        
        geneFamilyAssignment: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneFamilyAssignment(id);
        },
        
    },

    GeneFamilyAssignment: {
        geneFamily: async(geneFamilyAssignment, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneFamily(geneFamilyAssignment.geneFamilyId);
        },
    },

}
