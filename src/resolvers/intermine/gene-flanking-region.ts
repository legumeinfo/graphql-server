import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { sequenceFeatureFactory } from './sequence-feature.js';

export const geneFlankingRegionFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        geneFlankingRegion: async (_, { identifier }, { dataSources }) => {
            const {data: geneFlankingRegion} = await dataSources[sourceName].getGeneFlankingRegion(identifier);
            if (geneFlankingRegion == null) {
                const msg = `GeneFlankingRegion with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: geneFlankingRegion};
        },
    },
    GeneFlankingRegion: {
        ...sequenceFeatureFactory(sourceName),
        gene: async (geneFlankingRegion, _, { dataSources }) => {
            return dataSources[sourceName].getGene(geneFlankingRegion.geneIdentifier)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});
