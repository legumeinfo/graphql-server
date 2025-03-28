import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { hasGeneFactory } from './gene.js';
import { isSequenceFeatureFactory } from './sequence-feature.js';

export const geneFlankingRegionFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        geneFlankingRegion: async (_, { identifier }, { dataSources }) => {
            const {data: geneFlankingRegion} = await dataSources[sourceName].getGeneFlankingRegion(identifier);
            if (geneFlankingRegion == null) {
                const msg = `GeneFlankingRegion with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: geneFlankingRegion};
        },
    },
    GeneFlankingRegion: {
        ...isSequenceFeatureFactory(sourceName),
        ...hasGeneFactory(sourceName),
    },
});
