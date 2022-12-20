const geneFamilyAssignmentFactory = (sourceName) => ({
  Query: {
    geneFamilyAssignment: async (_source, { id }, { dataSources }) => {
      return dataSources[sourceName].getGeneFamilyAssignment(id);
    },
  },
  GeneFamilyAssignment: {
    geneFamily: async(geneFamilyAssignment, { }, { dataSources }) => {
      const id = geneFamilyAssignment.geneFamilyId;
      return dataSources[sourceName].getGeneFamily(id);
    },
  },
});


module.exports = geneFamilyAssignmentFactory;
