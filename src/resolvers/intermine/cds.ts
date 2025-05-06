import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {ResolverMap} from '../resolver.js';
import {isSequenceFeatureFactory} from './sequence-feature.js';
import {hasTranscriptFactory} from './transcript.js';

export const cdsFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    cds: async (_, {identifier}, {dataSources}) => {
      const {data: cds} = await dataSources[sourceName].getCDS(identifier);
      if (cds == null) {
        const msg = `CDS with identifier '${identifier}' not found`;
        inputError(msg);
      }
      return {results: cds};
    },
  },
  CDS: {
    ...isSequenceFeatureFactory(sourceName),
    ...hasTranscriptFactory(sourceName),
  },
});
