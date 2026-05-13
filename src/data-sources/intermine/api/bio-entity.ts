import {intermineJoin} from '../intermine.server.js';

export type BioEntityJoinOptions = {
  // Strain is OUTER by default (optional). Use INNER when filtering by strain
  strainJoinType?: 'INNER' | 'OUTER';
};

export function bioEntityJoinFactory(
  model = 'BioEntity',
  {strainJoinType = 'OUTER'}: BioEntityJoinOptions = {},
) {
  return [
    intermineJoin(`${model}.organism`, 'INNER'),
    intermineJoin(`${model}.strain`, strainJoinType),
  ];
}
