const phylotreeFactory = (sourceName) => ({
    Query: {
        phylotree: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getPhylotree(id);
        },
    },
    Phylotree: {
        geneFamily: async(phylotree, { }, { dataSources }) => {
            const id = phylotree.geneFamilyId;
            return dataSources[sourceName].getGeneFamily(id);
        },
        nodes: async (phylotree, { start, size }, { dataSources }) => {
            const args = {phylotree, start, size};
            return dataSources[sourceName].getPhylonodes(args);
        },
    },
});


module.exports = phylotreeFactory;
