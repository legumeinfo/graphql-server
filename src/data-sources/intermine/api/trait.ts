import {intermineJoin} from '../intermine.server.js';

export type TraitJoinOptions = {
  // Set to false when using OR constraints on Trait.gwas (incompatible with OUTER join)
  includeGwas?: boolean;
};

export function traitJoinFactory({includeGwas = true}: TraitJoinOptions = {}) {
  const joins = [
    intermineJoin('Trait.dataSets', 'OUTER'),
    intermineJoin('Trait.organism', 'OUTER'),
  ];
  if (includeGwas) {
    joins.push(intermineJoin('Trait.gwas', 'OUTER'));
  }
  return joins;
}
