import {intermineJoin} from '../intermine.server.js';
import {bioEntityJoinFactory} from './bio-entity.js';

export function proteinJoinFactory() {
  return [
    ...bioEntityJoinFactory('Protein'),
    intermineJoin('Protein.phylonode', 'OUTER'),
  ];
}
