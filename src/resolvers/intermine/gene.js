module.exports = {

    Query: {
        
        gene: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGene(id);
        },

        // genes: async (_source, { strain, family, description, start, size }, { dataSources }) => {
        //     const args = {
        //         strain,
        //         family,
        //         description,
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.getGenes(args);
        // },
        
        // geneSearch: async (_source, { keyword, start, size }, { dataSources }) => {
        //     const args = {
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.geneSearch(keyword, args);
        // },

    },

    Gene: {
        organism: async (gene, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getOrganism(gene.organismId);
        },
        strain: async (gene, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getStrain(gene.strainId);
        },
        geneFamilyAssignments: async (gene, { start, size }, { dataSources }) => {
            const args = {
                gene: gene,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGeneFamilyAssignments(args);
        },
        proteinDomains: async (gene, { start, size }, { dataSources }) => {
            const args = {
                gene: gene,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getProteinDomains(args);
        },
    },

}
