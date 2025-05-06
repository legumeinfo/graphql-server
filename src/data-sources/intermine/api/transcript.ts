import {sequenceFeatureJoinFactory} from './sequence-feature.js';

export function transcriptJoinFactory(model = 'Transcript') {
  return [...sequenceFeatureJoinFactory(model)];
}
