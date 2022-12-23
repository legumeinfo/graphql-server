const phyloNodeFactory = (sourceName) => ({
    Query: {
        phylonode: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getPhylonode(id);
        },
    },
    Phylonode: {
        tree: async(phylonode, { }, { dataSources }) => {
            const id = phylonode.treeId;
            return dataSources[sourceName].getPhylotree(id);
        },
        parent: async(phylonode, { }, { dataSources }) => {
            const id = phylonode.parentId;
            return dataSources[sourceName].getPhylonode(id);
        },
        children: async (phylonode, { start, size }, { dataSources }) => {
            const args = {parent: phylonode, start, size};
            return dataSources[sourceName].getPhylonodes(args);
        },
    },
});


module.exports = phyloNodeFactory;
