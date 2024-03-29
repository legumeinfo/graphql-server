import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const syntenyBlockFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        syntenyBlock: async (_, { id }, { dataSources }) => {
            const {data: block} = await dataSources[sourceName].getSyntenyBlock(id);
            if (block == null) {
                const msg = `SyntenyBlock with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: block};
        },
    },
    SyntenyBlock: {
        syntenicRegions: async (syntenyBlock, { page, pageSize }, { dataSources }) => {
            const args = {syntenyBlock, page, pageSize};
            return dataSources[sourceName].getSyntenicRegions(args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        dataSets: async (syntenyBlock, { page, pageSize }, { dataSources }) => {
            const args = {page, pageSize};
            return dataSources[sourceName].getDataSetsForSyntenyBlock(syntenyBlock, args)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
