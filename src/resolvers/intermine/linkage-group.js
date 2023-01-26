const linkageGroupFactory = (sourceName) => ({
    Query: {
        linkageGroup:  async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getLinkageGroup(id);
        },
    },
    LinkageGroup: {
        geneticMap: async (linkageGroup, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getGeneticMap(linkageGroup.geneticMapId);
        },
        qtls: async (linkageGroup, { start, size }, { dataSources }) => {
            const args = {
                linkageGroup: linkageGroup,
                start,
                size,
            };
            return dataSources.lisIntermineAPI.getQTLs(args);
        },
    },
});


module.exports = linkageGroupFactory;
