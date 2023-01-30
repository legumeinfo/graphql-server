const mineWebPropertiesFactory = (sourceName) => ({
    Query: {
        // return the web properties (promise) for the default data source
        mineWebProperties: async (_source, {}, { dataSources }) => {
            return dataSources[sourceName].getMineWebProperties();
        },

        // return the web properties (promise) for all the data sources
        mineWebPropertiesMulti: async (_source, {}, { dataSources }) => {
            return Object.keys(dataSources).map((sourceName) => {
                return dataSources[sourceName].getMineWebProperties();
            });
        },
    },
});


module.exports = mineWebPropertiesFactory;
