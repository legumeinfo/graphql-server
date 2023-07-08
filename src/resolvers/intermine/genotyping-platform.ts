import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';


export const genotypingPlatformFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        genotypingPlatform: async (_, { identifier }, { dataSources }) => {
            const {data: platform} = await dataSources[sourceName].getGenotypingPlatform(identifier);
            if (platform == null) {
                const msg = `GenotypingPlatform with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: platform};
        },
    },
    GenotypingPlatform: {
        ...annotatableFactory(sourceName),
    //     Doesn't have dataSets, maybe add in future mine model.
    //     dataSets: async (genotypingPlatform, { page, pageSize }, { dataSources }) => {
    //         const args = {page, pageSize};
    //         return dataSources[sourceName].getDataSetsForGenotypingPlatform(genotypingPlatform, args)
    //         // @ts-ignore: implicit type any error
    //             .then(({data: results}) => results);
    //     },
    },
});
