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
      return dataSources.lisMiniMineAPI.getOrganisms(args);
    },
    organism: async (_source, { id }, { dataSources }) => {
      return dataSources.lisMiniMineAPI.getOrganism(id);
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
      return dataSources.lisMiniMineAPI.getGenes(args);
    },
    gene: async (_source, { id }, { dataSources }) => {
      return dataSources.lisMiniMineAPI.getGene(id);
    },
    geneSearch: async (_source, { keyword, start, size }, { dataSources }) => {
      const args = {
          start,
          size,
        };
      return dataSources.lisMiniMineAPI.geneSearch(keyword, args);
    },

    // gene family API
    geneFamilies: async (_source, { start, size }, { dataSources }) => {
      const args = {
          start,
          size,
        };
      return dataSources.lisMiniMineAPI.getGeneFamilies(args);
    },
    geneFamily: async (_source, { id }, { dataSources }) => {
      return dataSources.lisMiniMineAPI.getGeneFamily(id);
    },

    // trait API
    traits: async (_source, { description, start, size }, { dataSources }) => {
      const args = {
        description,
        start,
        size,
      };
      return dataSources.lisMiniMineAPI.getTraits(args);
    },
    trait: async (_source, { id }, { dataSources }) => {
      return dataSources.lisMiniMineAPI.getTrait(id);
    },
    traitSearch: async (_source, { keyword, start, size }, { dataSources }) => {
      const args = {
        start,
        size,
      };
      return dataSources.lisMiniMineAPI.traitSearch(keyword, args);
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
      return dataSources.lisMiniMineAPI.getStrains(args);
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
      return dataSources.lisMiniMineAPI.getGenes(args);
    },
  },

  // gene attribute resolvers
  Gene: {
    strain: async (gene, { }, { dataSources }) => {
      const id = gene.strainId;
      return dataSources.lisMiniMineAPI.getStrain(id);
    },
    /*proteinDomains: async (gene, args, { dataSources }) => {
      args.gene = gene.id
      return dataSources.lisMiniMineAPI.getProteinDomains(args);
    },*/
    geneFamilyAssignments: async (gene, { }, { dataSources }) => {
      const id = gene.geneFamilyId;
      return dataSources.lisMiniMineAPI.getGeneFamily(id);
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
      return dataSources.lisMiniMineAPI.getGenes(args);
    },
  },

  // trait attribute resolvers
  Trait: {
  },
};


module.exports = { resolvers };
