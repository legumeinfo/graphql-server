// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {

  Query: {
    // organism API
    organisms: async (_source, { genus, start, size }, { dataSources }) => {
      const args = {
          genus,
          start,
          size,
        };
      return dataSources.legumemineAPI.getOrganisms(args);
    },
    organism: async (_source, { id }, { dataSources }) => {
      return dataSources.legumemineAPI.getOrganism(id);
    },

    // gene API
    genes: async (_source, { strain, family, description, start, size }, { dataSources }) => {
      const args = {
          strain,
          family,
          description,
          start,
          size,
        };
      return dataSources.legumemineAPI.getGenes(args);
    },
    gene: async (_source, { id }, { dataSources }) => {
      return dataSources.legumemineAPI.getGene(id);
    },
    geneSearch: async (_source, { keyword, start, size }, { dataSources }) => {
      const args = {
          start,
          size,
        };
      return dataSources.legumemineAPI.geneSearch(keyword, args);
    },

    // gene family API
    geneFamilies: async (_source, { start, size }, { dataSources }) => {
      const args = {
          start,
          size,
        };
      return dataSources.legumemineAPI.getGeneFamilies(args);
    },
    geneFamily: async (_source, { id }, { dataSources }) => {
      return dataSources.legumemineAPI.getGeneFamily(id);
    },
  },

  // organism attribute resolvers
  Organism: {
    strains: async (organism, { start, size }, { dataSources }) => {
      const args = {
          organism: organism.id,
          start,
          size,
        };
      return dataSources.legumemineAPI.getStrains(args);
    },
  },

  // strain attribute resolvers
  Strain: {
    genes: async (strain, { family, description, start, size }, { dataSources }) => {
      const args = {
          strain: strain.id,
          family,
          description,
          start,
          size,
        };
      return dataSources.legumemineAPI.getGenes(args);
    },
  },

  // gene attribute resolvers
  Gene: {
    strain: async (gene, { }, { dataSources }) => {
      const id = gene.strainId;
      return dataSources.legumemineAPI.getStrain(id);
    },
    /*proteinDomains: async (gene, args, { dataSources }) => {
      args.gene = gene.id
      return dataSources.legumemineAPI.getProteinDomains(args);
    },*/
    geneFamilyAssignments: async (gene, { }, { dataSources }) => {
      const id = gene.geneFamilyId;
      return dataSources.legumemineAPI.getGeneFamily(id);
    },
  },

  // gene family attribute resolvers
  GeneFamily: {
    genes: async (geneFamily, { strain, description, start, size }, { dataSources }) => {
      const args = {
          family: geneFamily.id,
          strain,
          description,
          start,
          size,
        };
      return dataSources.legumemineAPI.getGenes(args);
    },
  },
};


module.exports = { resolvers };
