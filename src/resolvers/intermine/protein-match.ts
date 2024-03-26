import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { bioEntityFactory } from './bio-entity.js';

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
        ...bioEntityFactory(sourceName),
        protein: async (proteinMatch, _, { dataSources }) => {
            return dataSources[sourceName].getProtein(proteinMatch.proteinIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
