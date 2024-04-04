import { intermineJoin } from '../intermine.server.js';

export function sequenceFeatureJoinFactory(model = 'SequenceFeature') {
    return [
        intermineJoin(`${model}.chromosome`, 'OUTER'),
        intermineJoin(`${model}.supercontig`, 'OUTER'),
        intermineJoin(`${model}.chromosomeLocation`, 'OUTER'),
        intermineJoin(`${model}.supercontigLocation`, 'OUTER'),
        intermineJoin(`${model}.sequenceOntologyTerm`, 'OUTER')
    ];
}
