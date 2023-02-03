export const linkageGroupFactory = (sourceName) => ({
    Query: {
        linkageGroup:  async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getLinkageGroup(id);
        },
    },
    LinkageGroup: {
        geneticMap: async (linkageGroup, { }, { dataSources }) => {
            return dataSources[sourceName].getGeneticMap(linkageGroup.geneticMapId);
        },
        dataSets: async (linkageGroup, { start, size }, { dataSources }) => {
            const args = {
                start,
                size
            };
            return dataSources[sourceName].getDataSetsForLinkageGroup(linkageGroup, args);
        },
        qtls: async (linkageGroup, { start, size }, { dataSources }) => {
            const args = {
                linkageGroup: linkageGroup,
                start,
                size,
            };
            return dataSources[sourceName].getQTLs(args);
        },
    },
});
