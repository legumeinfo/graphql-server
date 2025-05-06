import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {ResolverMap} from '../resolver.js';
import {isTranscriptFactory} from './transcript.js';

export const mRNAFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    mRNA: async (_, {identifier}, {dataSources}) => {
      const {data: mrna} = await dataSources[sourceName].getMRNA(identifier);
      if (mrna == null) {
        const msg = `mRNA with identifier '${identifier}' not found`;
        inputError(msg);
      }
      return {results: mrna};
    },
  },
  MRNA: {
    ...isTranscriptFactory(sourceName),
  },
});
