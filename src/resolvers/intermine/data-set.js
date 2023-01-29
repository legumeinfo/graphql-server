const dataSetFactory = (sourceName) => ({
    Query: {
        dataSet: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getDataSet(id);
        },
    },
    DataSet: {
        publication: async (dataSet, { }, { dataSources }) => {
            return dataSources[sourceName].getPublication(dataSet.publicationId);
        },
    },
});


module.exports = dataSetFactory;
