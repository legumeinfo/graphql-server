const geneFamilyAssignmentFactory = (sourceName) => ({
    Query: {
        geneFamilyAssignment: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamilyAssignment(id);
        },
    },
    GeneFamilyAssignment: {
        geneFamily: async(geneFamilyAssignment, { }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(geneFamilyAssignment.geneFamilyId);
        },
    },
});


module.exports = geneFamilyAssignmentFactory;
