const geneFamilyFactory = (sourceName) => ({
  Query: {
    geneFamily: async (_source, { id }, { dataSources }) => {
      return dataSources[sourceName].getGeneFamily(id);
    },
    //geneFamilies: async (_source, { start, size }, { dataSources }) => {
    //  const args = {start, size};
    //  return dataSources[sourceName].getGeneFamilies(args);
    //},
  },
  GeneFamily: {
    phylotree: async(geneFamily, { }, { dataSources }) => {
      return dataSources[sourceName].getPhylotree(geneFamily.phylotreeId);
    },
    genes: async (geneFamily, { start, size }, { dataSources }) => {
      const args = {geneFamily, start, size};
      return dataSources[sourceName].getGenes(args);
    },
    proteinDomains: async (geneFamily, { start, size }, { dataSources }) => {
      const args = {geneFamily, start, size};
      return dataSources[sourceName].getProteinDomains(args);
    },
  },
});


module.exports = geneFamilyFactory;
