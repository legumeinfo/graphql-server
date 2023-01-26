const linkageGroupPositionFactory = (sourceName) => ({
    Query: {
        linkageGroupPosition:  async (_source, { id }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getLinkageGroupPosition(id);
        },
    },
    LinkageGroupPosition: {
        linkageGroup: async (linkageGroupPosition, { }, { dataSources }) => {
            return dataSources.lisIntermineAPI.getLinkageGroup(linkageGroupPosition.linkageGroupId);
        },
    },
});


module.exports = linkageGroupPositionFactory;
