import {intermineJoin} from '../intermine.server.js';

export function geneFamilyJoinFactory() {
  return [
    intermineJoin(`GeneFamily.phylotree`, 'OUTER'),
  ];
}
