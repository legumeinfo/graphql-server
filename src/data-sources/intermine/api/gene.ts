import {intermineJoin} from '../intermine.server.js';
import {sequenceFeatureJoinFactory} from './sequence-feature.js';

// Gene join factory - extends sequence feature joins with OUTER joins for optional relationships
export function geneJoinFactory() {
  return [
    ...sequenceFeatureJoinFactory('Gene'),
    intermineJoin('Gene.upstreamIntergenicRegion', 'OUTER'),
    intermineJoin('Gene.downstreamIntergenicRegion', 'OUTER'),
  ];
}
