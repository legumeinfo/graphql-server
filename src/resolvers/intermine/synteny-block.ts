export const syntenyBlockFactory = (sourceName) => ({
    Query: {
        syntenyBlock: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getSyntenyBlock(id);
        },
    },
    SyntenyBlock: {
        syntenicRegions: async (syntenyBlock, { start, size }, { dataSources }) => {
            const args = {
                syntenyBlock: syntenyBlock,
                start,
                size
            };
            return dataSources[sourceName].getSyntenicRegions(args);
        },
        dataSets: async (syntenyBlock, { start, size }, { dataSources }) => {
            const args = {
                start,
                size
            };
            return dataSources[sourceName].getDataSetsForSyntenyBlock(syntenyBlock, args);
        },
    },
});
