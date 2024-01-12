import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableInterfaceFactory } from './annotatable-interface.js';

export const genotypingPlatformFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        genotypingPlatform: async (_, { identifier }, { dataSources }) => {
            const {data: genotypingPlatform} = await dataSources[sourceName].getGenotypingPlatform(identifier);
            if (genotypingPlatform == null) {
                const msg = `GenotypingPlatform with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: genotypingPlatform};
        },
    },
    GenotypingPlatform: {
        ...annotatableInterfaceFactory(sourceName),
        markers: async (genotypingPlatform, { page, pageSize }, { dataSources }) => {
            const args = {genotypingPlatform, page, pageSize};
            return dataSources[sourceName].getGeneticMarkers(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
