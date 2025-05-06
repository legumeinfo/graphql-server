import {intermineJoin} from '../intermine.server.js';
import {bioEntityJoinFactory} from './bio-entity.js';

export function sequenceFeatureJoinFactory(model = 'SequenceFeature') {
  return [
    ...bioEntityJoinFactory(model),
    intermineJoin(`${model}.chromosome`, 'OUTER'),
    intermineJoin(`${model}.supercontig`, 'OUTER'),
    intermineJoin(`${model}.chromosomeLocation`, 'OUTER'),
    intermineJoin(`${model}.supercontigLocation`, 'OUTER'),
    intermineJoin(`${model}.sequenceOntologyTerm`, 'OUTER'),
  ];
}
