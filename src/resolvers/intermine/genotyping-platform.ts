import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';


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
        ...annotatableFactory(sourceName),
        dataSets: async (genotypingPlatform, { page, pageSize }, { dataSources }) => {
            const args = {annotatable: genotypingPlatform, page, pageSize};
            return dataSources[sourceName].getDataSets(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        markers: async (genotypingPlatform, { page, pageSize }, { dataSources }) => {
            const args = {genotypingPlatform, page, pageSize};
            return dataSources[sourceName].getGeneticMarkers(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
