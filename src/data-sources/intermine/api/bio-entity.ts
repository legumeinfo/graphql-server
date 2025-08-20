import {intermineJoin} from '../intermine.server.js';

export function bioEntityJoinFactory(model = 'BioEntity') {
  return [
    intermineJoin(`${model}.organism`, 'INNER'),
    intermineJoin(`${model}.strain`, 'OUTER'),
  ];
}
