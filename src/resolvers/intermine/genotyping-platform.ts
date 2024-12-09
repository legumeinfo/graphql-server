import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
import { isAnnotatableFactory } from './annotatable.js';
import { hasGeneticMarkersFactory } from './genetic-marker.js';


export const genotypingPlatformFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        genotypingPlatform: async (_, { identifier }, { dataSources }) => {
            const {data: genotypingPlatform} = await dataSources[sourceName].getGenotypingPlatform(identifier);
            if (genotypingPlatform == null) {
                const msg = `GenotypingPlatform with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: genotypingPlatform};
        },
    },
    GenotypingPlatform: {
        ...isAnnotatableFactory(sourceName),
        ...hasGeneticMarkersFactory(sourceName),
    },
});


export const hasGenotypingPlatformFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    genotypingPlatform: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'GeneticMap':
            case 'GWAS':
                const {genotypingPlatformIdentifier} = parent;
                request = dataSources[sourceName].getGenotypingPlatform(genotypingPlatformIdentifier);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
