import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { isAnnotatableFactory } from './annotatable.js';


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
        ...isAnnotatableFactory(sourceName),
        syntenicRegions: async (syntenyBlock, _, { dataSources }) => {
            const {id} = syntenyBlock;
            return dataSources[sourceName].getSyntenicRegionsForSyntenyBlock(id)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
