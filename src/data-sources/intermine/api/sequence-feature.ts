import {intermineJoin} from '../intermine.server.js';
import {bioEntityJoinFactory, BioEntityJoinOptions} from './bio-entity.js';

export function sequenceFeatureJoinFactory(
  model = 'SequenceFeature',
  options: BioEntityJoinOptions = {},
) {
  return [
    ...bioEntityJoinFactory(model, options),
    intermineJoin(`${model}.sequence`, 'OUTER'),
    intermineJoin(`${model}.chromosome`, 'OUTER'),
    intermineJoin(`${model}.supercontig`, 'OUTER'),
    intermineJoin(`${model}.chromosomeLocation`, 'OUTER'),
    intermineJoin(`${model}.supercontigLocation`, 'OUTER'),
    intermineJoin(`${model}.sequenceOntologyTerm`, 'OUTER'),
  ];
}
