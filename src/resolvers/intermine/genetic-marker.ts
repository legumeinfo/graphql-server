import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {ResolverMap, SubfieldResolverMap} from '../resolver.js';
import {hasGWASResultsFactory} from './gwas-result.js';
import {hasQTLsFactory} from './qtl.js';
import {isSequenceFeatureFactory} from './sequence-feature.js';

export const geneticMarkerFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    geneticMarker: async (_, {identifier}, {dataSources}) => {
      const {data: marker} =
        await dataSources[sourceName].getGeneticMarker(identifier);
      if (marker == null) {
        const msg = `GeneticMarker with identifier '${identifier}' not found`;
        inputError(msg);
      }
      return {results: marker};
    },
  },
  GeneticMarker: {
    ...isSequenceFeatureFactory(sourceName),
    ...hasGWASResultsFactory(sourceName),
    ...hasQTLsFactory(sourceName),
    genotypingPlatforms: async (
      geneticMarker,
      {page, pageSize},
      {dataSources},
    ) => {
      const {id} = geneticMarker;
      const args = {page, pageSize};
      return (
        dataSources[sourceName]
          .getGenotypingPlatformsForGeneticMarker(id, args)
          // @ts-expect-error: implicit type any error
          .then(({data: results}) => results)
      );
    },
    linkageGroupPositions: async (
      geneticMarker,
      {page, pageSize},
      {dataSources},
    ) => {
      const {id} = geneticMarker;
      const args = {page, pageSize};
      return (
        dataSources[sourceName]
          .getLinkageGroupPositionsForGeneticMarker(id, args)
          // @ts-expect-error: implicit type any error
          .then(({data: results}) => results)
      );
    },
  },
});

export const hasGeneticMarkersFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  markers: async (parent, {page, pageSize}, {dataSources}, info) => {
    let request: Promise<any> | null = null;

    const args = {page, pageSize};

    const {id} = parent;
    const typeName = info.parentType.name;
    switch (typeName) {
      case 'GenotypingPlatform':
        request = dataSources[
          sourceName
        ].getGeneticMarkersForGenotypingPlatform(id, args);
        break;
      case 'GWASResult':
        request = dataSources[sourceName].getGeneticMarkersForGWASResult(
          id,
          args,
        );
        break;
      case 'QTL':
        request = dataSources[sourceName].getGeneticMarkersForQTL(id, args);
        break;
    }

    if (request == null) {
      return null;
    }

    return request.then(({data: results}) => results);
  },
});
