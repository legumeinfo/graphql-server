const phylotreeFactory = (sourceName) => ({
    Query: {
        phylotree: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getPhylotree(id);
        },
    },
    Phylotree: {
        geneFamily: async(phylotree, { }, { dataSources }) => {
            return dataSources[sourceName].getGeneFamily(phylotree.geneFamilyId);
        },
        dataSets: async (phylotree, { start, size }, { dataSources }) => {
            const args = {
                phylotree: phylotree,
                start,
                size
            };
            return dataSources[sourceName].getDataSets(args);
        },
        nodes: async (phylotree, { start, size }, { dataSources }) => {
            const args = {phylotree, start, size};
            return dataSources[sourceName].getPhylonodes(args);
        },
    },
});


module.exports = phylotreeFactory;
