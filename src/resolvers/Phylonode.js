module.exports = {
    
    Query: {

        phylonode: async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getPhylonode(id);
        },

    },

    Phylonode: {
        tree: async(phylonode, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getPhylotree(phylonode.treeId);
        },
        parent: async(phylonode, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getPhylonode(phylonode.parentId);
        },
        children: async (phylonode, { start, size }, { dataSources }) => {
            const args = {
                parent: phylonode,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getPhylonodes(args);
        },
    },

}
