export const mineWebPropertiesFactory = (sourceName) => ({
    Query: {
        mineWebProperties: async (_source, {}, { dataSources }) => {
            return dataSources[sourceName].getMineWebProperties();
        },
    },
});
