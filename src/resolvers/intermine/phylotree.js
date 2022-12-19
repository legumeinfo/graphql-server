module.exports = {
    
    Query: {

        phylotree: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getPhylotree(id);
        },

    },

    Phylotree: {
        geneFamily: async(phylotree, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneFamily(phylotree.geneFamilyId);
        },
        nodes: async (phylotree, { start, size }, { dataSources }) => {
            const args = {
                phylotree: phylotree,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getPhylonodes(args);
        },
    },
    
}
