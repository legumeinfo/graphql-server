import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {ResolverMap} from '../resolver.js';
import {isAnnotatableFactory} from './annotatable.js';
import {hasGenotypingPlatformFactory} from './genotyping-platform.js';
import {hasOrganismFactory} from './organism.js';

export const geneticMapFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    geneticMap: async (_, {identifier}, {dataSources}) => {
      const {data: map} =
        await dataSources[sourceName].getGeneticMap(identifier);
      if (map == null) {
        const msg = `GeneticMap with identifier '${identifier}' not found`;
        inputError(msg);
      }
      return {results: map};
    },
    geneticMaps: async (_, {description, page, pageSize}, {dataSources}) => {
      const args = {description, page, pageSize};
      return (
        dataSources[sourceName]
          .searchGeneticMaps(args)
          // @ts-expect-error: implicit type any error
          .then(({data: results, metadata: {pageInfo}}) => ({
            results,
            pageInfo,
          }))
      );
    },
  },
  GeneticMap: {
    ...isAnnotatableFactory(sourceName),
    ...hasGenotypingPlatformFactory(sourceName),
    ...hasOrganismFactory(sourceName),
    linkageGroups: async (geneticMap, {page, pageSize}, {dataSources}) => {
      const {id} = geneticMap;
      const args = {page, pageSize};
      return (
        dataSources[sourceName]
          .getLinkageGroupsForGeneticMap(id, args)
          // @ts-expect-error: implicit type any error
          .then(({data: results}) => results)
      );
    },
  },
});
