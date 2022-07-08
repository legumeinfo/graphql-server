// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {

  Query: {
    // organism API
    organisms: async (_source, { genus, start, size }, { dataSources }) => {
      return dataSources.legumemineAPI.getOrganisms({genus, start, size});
    },
    organism: async (_source, { id }, { dataSources }) => {
      return dataSources.legumemineAPI.getOrganism(id);
    },

    // gene API
    genes: async (_source, { strain, family, description, start, size }, { dataSources }) => {
      return dataSources.legumemineAPI.getGenes({strain, family, description, start, size});
    },
    gene: async (_source, { id }, { dataSources }) => {
      return dataSources.legumemineAPI.getGene(id);
    },

    // gene family API
    geneFamilies: async (_source, { start, size }, { dataSources }) => {
      return dataSources.legumemineAPI.getGeneFamilies(start, size);
    },
    geneFamily: async (_source, { id }, { dataSources }) => {
      return dataSources.legumemineAPI.getGeneFamily(id);
    },
  },

  // organism attribute resolvers
  Organism: {
    strains: async (organism, args, { dataSources }) => {
      args.organism = organism.id;
      return dataSources.legumemineAPI.getStrains(args);
    },
  },

  // strain attribute resolvers
  Strain: {
    genes: async (strain, args, { dataSources }) => {
      args.strain = strain.id;
      return dataSources.legumemineAPI.getGenes(args);
    },
  },

  // gene attribute resolvers
  Gene: {
    strain: async (gene, { }, { dataSources }) => {
      return dataSources.legumemineAPI.getStrain(gene.strainId);
    },
    /*proteinDomains: async (gene, args, { dataSources }) => {
      args.gene = gene.id
      return dataSources.legumemineAPI.getProteinDomains(args);
    },*/
    geneFamilyAssignments: async (gene, { }, { dataSources }) => {
      return dataSources.legumemineAPI.getGeneFamily(gene.geneFamilyId);
    },
  },

  // gene family attribute resolvers
  GeneFamily: {
    genes: async (geneFamily, args, { dataSources }) => {
      args.family = geneFamily.id;
      return dataSources.legumemineAPI.getGenes(args);
    },
  },
};


module.exports = { resolvers };
