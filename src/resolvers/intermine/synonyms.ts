import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {KeyOfType} from '../../utils/index.js';
import {SubfieldResolverMap} from '../resolver.js';

export const hasSynonymsFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  synonyms: async (parent, _, {dataSources}, info) => {
    let request: Promise<string[]> | null = null;

    const {id} = parent;
    const typeName = info.parentType.name;
    switch (typeName) {
      case 'GeneFunction':
        request = dataSources[sourceName].getSynonymsForGeneFunction(id);
        break;
    }

    if (request == null) {
      return [];
    }

    return request;
  },
});
