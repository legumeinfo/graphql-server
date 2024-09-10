import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';


export const panGenePairFactory =
    (
        sourceName: KeyOfType<DataSources, IntermineAPI>,
    ): ResolverMap => ({
        Query: {
            panGenePairs: async (_, { identifiers, genus, species, strain, assembly, annotation, page, pageSize }, { dataSources }) => {
                const args = {genus, species, strain, assembly, annotation, page, pageSize};
                return dataSources[sourceName].getPanGenePairs(identifiers, args)
                    // @ts-ignore: implicit type any error
                    .then(({data: results, metadata: {pageInfo, resultsInfo}}) => {
                        return {results, pageInfo, resultsInfo};
                    });
            },
        },
        PanGenePair: {
            panGeneSet: async (panGenePair, _, { dataSources }) => {
                const {panGeneSetIdentifier} = panGenePair;
                return dataSources[sourceName].getPanGeneSet(panGeneSetIdentifier)
                    // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            query: async (panGenePair, _, { dataSources }) => {
                const {queryGeneIdentifier} = panGenePair;
                return dataSources[sourceName].getGene(queryGeneIdentifier)
                    // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
            result: async (panGenePair, _, { dataSources }) => {
                const {resultGeneIdentifier} = panGenePair;
                return dataSources[sourceName].getGene(resultGeneIdentifier)
                    // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
            },
        },
    });
