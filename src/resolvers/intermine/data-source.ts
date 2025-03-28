import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { hasDataSetsFactory } from './data-set.js';

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
        ...hasDataSetsFactory(sourceName),
        // publications:
    },
});
