import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { isBioEntityFactory } from './bio-entity.js';
import { hasProteinFactory } from './protein.js';

export const proteinMatchFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        proteinMatch: async (_, { identifier }, { dataSources }) => {
            const {data: proteinMatch} = await dataSources[sourceName].getProteinMatch(identifier);
            if (proteinMatch == null) {
                const msg = `ProteinMatch with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: proteinMatch};
        },
    },
    ProteinMatch: {
        ...isBioEntityFactory(sourceName),
        ...hasProteinFactory(sourceName),
    },
});
