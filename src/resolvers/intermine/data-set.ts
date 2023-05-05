import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const dataSetFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        dataSet: async (_, { name }, { dataSources }) => {
            const dataset = dataSources[sourceName].getDataSet(name);
            if (dataset == null) {
                const msg = `DataSet with name '${name}' not found`;
                inputError(msg);
            }
            return dataset;
        },
    },
    DataSet: {
        publication: async (dataSet, _, { dataSources }) => {
            return dataSources[sourceName].getPublication(dataSet.publicationDOI);
        },
    },
});
