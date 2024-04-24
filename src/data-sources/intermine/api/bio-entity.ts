import { intermineJoin } from '../intermine.server.js';

export function bioEntityJoinFactory(model = 'BioEntity') {
    return [
        intermineJoin(`${model}.organism`, 'OUTER'),
        intermineJoin(`${model}.strain`, 'OUTER'),
    ];
}
