import { DataSources } from '../../data-sources/index.js';
import { ResolverMap } from '../resolver.js';


export const dataSetFactory = (sourceName: keyof DataSources): ResolverMap => ({
    Query: {
        dataSet: async (_source, { id }, { dataSources }) => {
            return dataSources[sourceName].getDataSet(id);
        },
        // dataSets: async (_source, { description, start, size }, { dataSources }) => {
        //     const args = {description, start, size};
        //     return dataSources[sourceName].searchDataSets(args);
        // },
    },
    DataSet: {
        publication: async (dataSet, { }, { dataSources }) => {
            return dataSources[sourceName].getPublication(dataSet.publicationId);
        },
    },
});
