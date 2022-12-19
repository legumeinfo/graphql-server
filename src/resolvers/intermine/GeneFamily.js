module.exports = {
    
    Query: {

        geneFamily: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneFamily(id);
        },
        
        // geneFamilies: async (_source, { start, size }, { dataSources }) => {
        //     const args = {
        //         start,
        //         size,
        //     };
        //     return dataSources.lisIntermineAPI.getGeneFamilies(args);
        // },

    },

    GeneFamily: {
        phylotree: async(geneFamily, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getPhylotree(geneFamily.phylotreeId);
        },
        genes: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {
                geneFamily: geneFamily,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getGenes(args);
        },
        proteinDomains: async (geneFamily, { start, size }, { dataSources }) => {
            const args = {
                geneFamily: geneFamily,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getProteinDomains(args);
        },
    }, 
   

}
