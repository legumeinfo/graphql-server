import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const dataSetFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        dataSet: async (_, { id }, { dataSources }) => {
            return dataSources[sourceName].getDataSet(id);
        },
        // dataSets: async (_, { description, start, size }, { dataSources }) => {
        //     const args = {description, start, size};
        //     return dataSources[sourceName].searchDataSets(args);
        // },
    },
    DataSet: {
        publication: async (dataSet, _, { dataSources }) => {
            return dataSources[sourceName].getPublication(dataSet.publicationId);
        },
    },
});
