import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureFactory } from './sequence-feature.js';

export const intergenicRegionFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        intergenicRegion: async (_, { identifier }, { dataSources }) => {
            const {data: intergenicRegion} = await dataSources[sourceName].getIntergenicRegion(identifier);
            if (intergenicRegion == null) {
                const msg = `IntergenicRegion with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: intergenicRegion};
        },
    },
    IntergenicRegion: {
        ...sequenceFeatureFactory(sourceName),
        adjacentGenes: async (intergenicRegion, { page, pageSize }, { dataSources }) => {
            const args = {intergenicRegion, page, pageSize};
            return dataSources[sourceName].getAdjacentGenes(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
