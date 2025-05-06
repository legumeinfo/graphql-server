import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {ResolverMap, SubfieldResolverMap} from '../resolver.js';
import {isAnnotatableFactory} from './annotatable.js';
import {hasGeneticMarkersFactory} from './genetic-marker.js';
import {hasGWASFactory} from './gwas.js';
import {hasTraitFactory} from './trait.js';

export const gwasResultFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    gwasResult: async (_, {identifier}, {dataSources}) => {
      const {data: result} =
        await dataSources[sourceName].getGWASResult(identifier);
      if (result == null) {
        const msg = `GWASResult with identifier '${identifier}' not found`;
        inputError(msg);
      }
      return {results: result};
    },
  },
  GWASResult: {
    ...isAnnotatableFactory(sourceName),
    ...hasGeneticMarkersFactory(sourceName),
    ...hasGWASFactory(sourceName),
    ...hasTraitFactory(sourceName),
  },
});

export const hasGWASResultsFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  gwasResults: async (parent, {page, pageSize}, {dataSources}, info) => {
    let request: Promise<any> | null = null;

    const {id} = parent;
    const args = {page, pageSize};
    const typeName = info.parentType.name;
    switch (typeName) {
      case 'GeneticMarker':
        request = dataSources[sourceName].getGWASResultsForGeneticMarker(
          id,
          args,
        );
        break;
      case 'GWAS':
        request = dataSources[sourceName].getGWASResultsForGWAS(id, args);
        break;
      case 'Trait':
        request = dataSources[sourceName].getGWASResultsForTrait(id, args);
        break;
    }

    if (request == null) {
      return null;
    }

    return request.then(({data: results}) => results);
  },
});
