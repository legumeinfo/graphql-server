import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {KeyOfType} from '../../utils/index.js';
import {ResolverMap} from '../resolver.js';
import {getQueryFields} from '../utils/query-fields.js';

export const panGenePairFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    panGenePairs: async (
      _,
      {
        identifiers,
        genus,
        species,
        strain,
        assembly,
        annotation,
        page,
        pageSize,
      },
      {dataSources},
    ) => {
      const args = {
        genus,
        species,
        strain,
        assembly,
        annotation,
        page,
        pageSize,
      };
      return (
        dataSources[sourceName]
          .getPanGenePairs(identifiers, args)
          // @ts-expect-error: implicit type any error
          .then(({data: results, metadata: {pageInfo, resultsInfo}}) => {
            return {results, pageInfo, resultsInfo};
          })
      );
    },
  },
  PanGenePair: {
    panGeneSet: async (panGenePair, _, {dataSources}, info) => {
      const {panGeneSetIdentifier} = panGenePair;
      if (panGeneSetIdentifier === null) {
        return null;
      }
      const fields = getQueryFields(info);
      return (
        dataSources[sourceName]
          .getPanGeneSet(panGeneSetIdentifier, fields)
          // @ts-expect-error: implicit type any error
          .then(({data: results}) => results)
      );
    },
    query: async (panGenePair, _, {dataSources}, info) => {
      const fields = getQueryFields(info);
      const {queryGeneIdentifier} = panGenePair;
      return (
        dataSources[sourceName]
          .getGene(queryGeneIdentifier, fields)
          // @ts-expect-error: implicit type any error
          .then(({data: results}) => results)
      );
    },
    result: async (panGenePair, _, {dataSources}, info) => {
      const {resultGeneIdentifier} = panGenePair;
      if (resultGeneIdentifier === null) {
        return null;
      }
      const fields = getQueryFields(info);
      return (
        dataSources[sourceName]
          .getGene(resultGeneIdentifier, fields)
          // @ts-expect-error: implicit type any error
          .then(({data: results}) => results)
      );
    },
  },
});
