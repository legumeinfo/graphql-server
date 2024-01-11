import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { annotatableInterfaceFactory } from './annotatable-interface.js';

// for INTERNAL resolution of Annotatable references and collections
export const annotatableFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        annotatable: async (_, { id }, { dataSources }) => {
            const {data: source} = await dataSources[sourceName].getAnnotatable(id);
            if (source == null) {
                const msg = `Annotatable with id '${id}' not found`;
                inputError(msg);
            }
            return {results: source};
        },
    },
    Annotatable: {
        ...annotatableInterfaceFactory(sourceName),
    },
});
