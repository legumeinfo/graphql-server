import {intermineJoin} from '../intermine.server.js';

export function geneJoinFactory(model = 'Gene') {
    console.log(`HERE!`);
  return [
    intermineJoin(`${model}.organism`, 'INNER'),
    intermineJoin(`${model}.strain`, 'OUTER'),
    intermineJoin(`${model}.chromosome`, 'OUTER'),
    intermineJoin(`${model}.supercontig`, 'OUTER'),
    intermineJoin(`${model}.chromosomeLocation`, 'OUTER'),
    intermineJoin(`${model}.supercontigLocation`, 'OUTER'),
    intermineJoin(`${model}.sequenceOntologyTerm`, 'OUTER'),
  ];
}
