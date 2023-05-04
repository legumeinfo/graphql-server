import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const dataSetFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        dataSet: async (_, { name }, { dataSources }) => {
            return dataSources[sourceName].getDataSet(name);
        },
    },
    DataSet: {
        publication: async (dataSet, _, { dataSources }) => {
            return dataSources[sourceName].getPublication(dataSet.publicationDOI);
        },
    },
});
