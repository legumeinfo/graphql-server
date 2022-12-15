// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {

    Query: {

        // organism API
        organism: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(id);
        },
        organisms: async (_source, { genus, start, size }, { dataSources }) => {
            const args = {
                genus,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getOrganisms(args);
        },

        // strain API
        strain: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getStrain(id);
        },
        strains: async (_source, { organismId }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getStrains(organismId);
        },

        // gene API
        gene: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGene(id);
        },
        genes: async (_source, { strain, family, description, start, size }, { dataSources }) => {
            const args = {
                strain,
                family,
                description,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGenes(args);
        },
        geneSearch: async (_source, { keyword, start, size }, { dataSources }) => {
            const args = {
                start,
                size,
            };
            return dataSources.lisIntermineAPI.geneSearch(keyword, args);
        },

        // gene family API
        geneFamilies: async (_source, { start, size }, { dataSources }) => {
            const args = {
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGeneFamilies(args);
        },
        geneFamily: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneFamily(id);
        },

        // trait API
        traits: async (_source, { description, start, size }, { dataSources }) => {
            const args = {
                description,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getTraits(args);
        },
        trait: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getTrait(id);
        },
        traitSearch: async (_source, { keyword, start, size }, { dataSources }) => {
            const args = {
                start,
                size,
            };
            return dataSources.lisIntermineAPI.traitSearch(keyword, args);
        },
    },

    /////////////////////////
    // ATTRIBUTE RESOLVERS //
    /////////////////////////

    Organism: {
        strains: async (organism, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getStrains(organism.id);
        },
    },

    Strain: {
        organism: async (strain, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(strain.organismId);
        },
    },

    Gene: {
        // uses temporary strainId attribute from intermine.models
        strain: async (gene, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getStrain(gene.strainId);
        },
        // proteinDomains: async (gene, { start, size }, { dataSources }) => {
        //     const args = {
        //         geneId: gene.id,
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.getProteinDomains(args);
        // },
        // geneFamilyAssignments: async (gene, { }, { dataSources }) => {
        //     return dataSources.lisIntermineAPI.getGeneFamilyAssignments(gene.id);
        // },
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
            return dataSources.lisIntermineAPI.getGenes(args);
        },
    },

    // trait attribute resolvers
    Trait: {
    },
};


module.exports = { resolvers };
