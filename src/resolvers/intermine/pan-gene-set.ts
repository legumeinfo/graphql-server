import {
  DataSources,
  IntermineAPI,
  MicroservicesAPI,
} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {hasLinkoutsFactory} from '../microservices/linkouts.js';
import {ResolverMap, SubfieldResolverMap} from '../resolver.js';
import {isAnnotatableFactory} from './annotatable.js';
import {hasGenesFactory} from './gene.js';
import {hasProteinsFactory} from './protein.js';
import {hasTranscriptsFactory} from './transcript.js';

export const panGeneSetFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
  microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
): ResolverMap => ({
  Query: {
    panGeneSet: async (_, {identifier}, {dataSources}) => {
      const {data: panGeneSet} =
        await dataSources[sourceName].getPanGeneSet(identifier);
      if (panGeneSet == null) {
        const msg = `PanGeneSet with identifier '${identifier}' not found`;
        inputError(msg);
      }
      return {results: panGeneSet};
    },
  },
  PanGeneSet: {
    ...isAnnotatableFactory(sourceName),
    ...hasGenesFactory(sourceName),
    ...hasLinkoutsFactory(microservicesSource),
    ...hasProteinsFactory(sourceName),
    ...hasTranscriptsFactory(sourceName),
  },
});

export const hasPanGeneSetsFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  panGeneSets: async (parent, {page, pageSize}, {dataSources}, info) => {
    let request: Promise<any> | null = null;

    const args = {page, pageSize};

    const interfaces = info.parentType.getInterfaces().map(({name}) => name);
    if (interfaces.includes('Transcript')) {
      const {id} = parent;
      request = dataSources[sourceName].getPanGeneSetsForTranscript(id, args);
    }

    const {id} = parent;
    const typeName = info.parentType.name;
    switch (typeName) {
      case 'Gene':
        request = dataSources[sourceName].getPanGeneSetsForGene(id, args);
        break;
      case 'Protein':
        request = dataSources[sourceName].getPanGeneSetsForProtein(id, args);
        break;
    }

    if (request == null) {
      return null;
    }

    return request.then(({data: results}) => results);
  },
});
