import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';

export const dataSourceFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        dataSource: async (_, { name }, { dataSources }) => {
            const {data: dataset} = await dataSources[sourceName].getDataSource(name);
            if (dataset == null) {
                const msg = `DataSource with name '${name}' not found`;
                inputError(msg);
            }
            return {results: dataset};
        },
    },
    DataSource: {
        // publications:
        dataSets: async (dataSource, { page, pageSize }, { dataSources }) => {
            const {id} = dataSource;
            const args = {page, pageSize};
            return dataSources[sourceName].getDataSetsForDataSource(id, args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
