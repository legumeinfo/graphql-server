import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';

export const dataSetFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        dataSet: async (_, { name }, { dataSources }) => {
            const {data: dataset} = await dataSources[sourceName].getDataSet(name);
            if (dataset == null) {
                const msg = `DataSet with name '${name}' not found`;
                inputError(msg);
            }
            return {results: dataset};
        },
    },
    DataSet: {
        dataSource: async (dataSet, _, { dataSources }) => {
            return dataSources[sourceName].getDataSource(dataSet.dataSourceName)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        publication: async (dataSet, _, { dataSources }) => {
            return dataSources[sourceName].getPublication(dataSet.publicationDOI)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        bioEntities: async (dataSet, { page, pageSize }, { dataSources }) => {
            const args = {dataSet: dataSet, page, pageSize};
            return dataSources[sourceName].getBioEntities(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
