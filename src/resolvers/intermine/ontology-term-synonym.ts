import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {ResolverMap} from '../resolver.js';

export const ontologyTermSynonymFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    ontologyTermSynonym: async (_, {name}, {dataSources}) => {
      const {data: ontologyTermSynonym} =
        await dataSources[sourceName].getOntologyTermSynonym(name);
      if (ontologyTermSynonym == null) {
        const msg = `OntologyTermSynonym with name '${name}' not found`;
        inputError(msg);
      }
      return {results: ontologyTermSynonym};
    },
  },
});
