const geneFactory = (sourceName) => ({
  Query: {
    gene: async (_source, { id }, { dataSources }) => {
      return dataSources[sourceName].getGene(id);
    },
    //genes: async (_source, { strain, family, description, start, size }, { dataSources }) => {
    //  const args = {
    //      strain,
    //      family,
    //      description,
    //      start,
    //      size,
    //    };
    //  return dataSources[sourceName].getGenes(args);
    //},
    //geneSearch: async (_source, { keyword, start, size }, { dataSources }) => {
    //  const args = {start, size};
    //  return dataSources[sourceName].geneSearch(keyword, args);
    //},
  },
  Gene: {
    organism: async (gene, { }, { dataSources }) => {
      return dataSources[sourceName].getOrganism(gene.organismId);
    },
    strain: async (gene, { }, { dataSources }) => {
      const id = gene.strainId;
      return dataSources[sourceName].getStrain(id);
    },
    geneFamilyAssignments: async (gene, { start, size }, { dataSources }) => {
      const args = {gene, start, size};
      return dataSources[sourceName].getGeneFamilyAssignments(args);
    },
    proteinDomains: async (gene, { start, size }, { dataSources }) => {
      const args = {gene, start, size};
      return dataSources[sourceName].getProteinDomains(args);
    },
  },
});


module.exports = geneFactory;
