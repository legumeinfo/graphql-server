const strainFactory = (sourceName) => ({
  Query: {
    strain: async (_source, { id }, { dataSources }) => {
      return dataSources[sourceName].getStrain(id);
    },
    //strains: async (_source, { organismId }, { dataSources }) => {
    //  return dataSources[sourceName].getStrains(organismId);
    //},
  },
  Strain: {
    organism: async (strain, { }, { dataSources }) => {
      const id = strain.organismId;
      return dataSources[sourceName].getOrganism(id);
    },
  },
});


module.exports = strainFactory;
