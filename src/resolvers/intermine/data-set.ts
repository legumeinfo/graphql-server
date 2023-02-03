export const dataSetFactory = (sourceName) => ({
    Query: {
        dataSet: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getDataSet(id);
        },
        // dataSets: async (_source, { description, start, size }, { dataSources }) => {
        //     const args = {
        //         description,
        //         start,
        //         size,
        //     };
        //     return dataSources[sourceName].searchDataSets(args);
        // },
    },
    DataSet: {
        publication: async (dataSet, { }, { dataSources }) => {
            return dataSources[sourceName].getPublication(dataSet.publicationId);
        },
    },
});
