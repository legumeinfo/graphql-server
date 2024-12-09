import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { isAnnotatableFactory } from './annotatable.js';
import { hasGenesFactory } from './gene.js';


export const pathwayFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        pathway: async (_, { identifier }, { dataSources }) => {
            const {data: pathway} = await dataSources[sourceName].getPathway(identifier);
            if (pathway == null) {
                const msg = `Pathway with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: pathway};
        },
    },
    Pathway: {
        ...isAnnotatableFactory(sourceName),
        ...hasGenesFactory(sourceName),
    },
});
