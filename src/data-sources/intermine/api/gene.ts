import {intermineJoin} from '../intermine.server.js';
import {BioEntityJoinOptions} from './bio-entity.js';
import {sequenceFeatureJoinFactory} from './sequence-feature.js';

export function geneJoinFactory(options: BioEntityJoinOptions = {}) {
  return [
    ...sequenceFeatureJoinFactory('Gene', options),
    intermineJoin('Gene.upstreamIntergenicRegion', 'OUTER'),
    intermineJoin('Gene.downstreamIntergenicRegion', 'OUTER'),
  ];
}
