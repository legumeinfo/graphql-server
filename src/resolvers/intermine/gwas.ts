import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {ResolverMap, SubfieldResolverMap} from '../resolver.js';
import {isAnnotatableFactory} from './annotatable.js';
import {hasGenotypingPlatformFactory} from './genotyping-platform.js';
import {hasGWASResultsFactory} from './gwas-result.js';
import {hasOrganismFactory} from './organism.js';

export const gwasFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    gwas: async (_, {identifier}, {dataSources}) => {
      const {data: gwas} = await dataSources[sourceName].getGWAS(identifier);
      if (gwas == null) {
        const msg = `GWAS with identifier '${identifier}' not found`;
        inputError(msg);
      }
      return {results: gwas};
    },
    gwases: async (_, {description, page, pageSize}, {dataSources}) => {
      const args = {description, page, pageSize};
      return (
        dataSources[sourceName]
          .searchGWASes(args)
          // @ts-expect-error: implicit type any error
          .then(({data: results, metadata: {pageInfo}}) => ({
            results,
            pageInfo,
          }))
      );
    },
  },
  GWAS: {
    ...isAnnotatableFactory(sourceName),
    ...hasGenotypingPlatformFactory(sourceName),
    ...hasGWASResultsFactory(sourceName),
    ...hasOrganismFactory(sourceName),
  },
});

export const hasGWASFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  gwas: async (parent, _, {dataSources}, info) => {
    let request: Promise<any> | null = null;

    const typeName = info.parentType.name;
    switch (typeName) {
      case 'GWASResult':
      case 'Trait': {
        const {gwasIdentifier} = parent;
        request = dataSources[sourceName].getGWAS(gwasIdentifier);
        break;
      }
    }

    if (request == null) {
      return null;
    }

    return request.then(({data: results}) => results);
  },
});
