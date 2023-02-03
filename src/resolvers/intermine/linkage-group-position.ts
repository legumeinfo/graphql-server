export const linkageGroupPositionFactory = (sourceName) => ({
    Query: {
        linkageGroupPosition:  async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroupPosition(id);
        },
    },
    LinkageGroupPosition: {
        linkageGroup: async (linkageGroupPosition, { }, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroup(linkageGroupPosition.linkageGroupId);
        },
    },
});
