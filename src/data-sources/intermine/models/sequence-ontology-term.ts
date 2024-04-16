import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  intermineDataSetAttributesFactory,
  intermineDataSetSortFactory,
} from './data-set.js';
import {
  intermineOntologyTermInterfaceAttributesFactory,
  intermineOntologyTermInterfaceSortFactory,
  graphqlOntologyTermInterfaceAttributes,
  IntermineOntologyTermInterface,
} from './ontology-term-interface.js';
import {
  intermineOntologyTermSynonymAttributesFactory,
  intermineOntologyTermSynonymSortFactory,
} from './ontology-term-synonym.js';

export const intermineSequenceOntologyTermAttributes = [
    ...intermineOntologyTermInterfaceAttributesFactory('SOTerm'),
]
export const intermineSequenceOntologyTermSort = intermineOntologyTermInterfaceSortFactory('SOTerm');

export type IntermineSequenceOntologyTerm = [
    ...IntermineOntologyTermInterface,
];

export const graphqlSequenceOntologyTermAttributes = [
    ...graphqlOntologyTermInterfaceAttributes,
];

export type GraphQLSequenceOntologyTerm = {
    [prop in typeof graphqlSequenceOntologyTermAttributes[number]]: string;
}

export type IntermineSequenceOntologyTermResponse = IntermineDataResponse<IntermineSequenceOntologyTerm>;

export function response2SequenceOntologyTerms(response: IntermineSequenceOntologyTermResponse): Array<GraphQLSequenceOntologyTerm> {
    return response2graphqlObjects(response, graphqlSequenceOntologyTermAttributes);
}

// SOTerm.relations has no reverse reference
export const intermineSequenceOntologyTermRelationAttributes = [
    'SOTerm.relations.id',
    'SOTerm.relations.redundant',
    'SOTerm.relations.direct',   
    'SOTerm.relations.relationship',
    'SOTerm.relations.parentTerm.id', // resolve reference
    'SOTerm.relations.childTerm.id',  // resolve reference
];
export const intermineSequenceOntologyTermRelationSort = 'SOTerm.relations.id';
// use IntermineOntologyRelation
// use graphqlOntologyRelationAttributes

// SOTerm.synonyms has no reverse reference
export const intermineSequenceOntologyTermSynonymAttributes = intermineOntologyTermSynonymAttributesFactory('SOTerm.synonyms');
export const intermineSequenceOntologyTermSynonymSort = intermineOntologyTermSynonymSortFactory('SOTerm.synonyms');

// SOTerm.parents has no reverse reference
export const intermineSequenceOntologyTermParentAttributes = intermineOntologyTermInterfaceAttributesFactory('SOTerm.parents');
export const intermineSequenceOntologyTermParentSort = intermineOntologyTermInterfaceSortFactory('SOTerm.parents');

// OntologyTerm.dataSets has no reverse reference
export const intermineSequenceOntologyTermDataSetAttributes = intermineDataSetAttributesFactory('SOTerm.dataSets');
export const intermineSequenceOntologyTermDataSetSort = intermineDataSetSortFactory('SOTerm.dataSets');

// SOTerm.crossReferences has no reverse reference
export const intermineSequenceOntologyTermCrossReferenceAttributes = intermineOntologyTermInterfaceAttributesFactory('SOTerm.crossReferences');
export const intermineSequenceOntologyTermCrossReferenceSort = intermineOntologyTermInterfaceSortFactory('SOTerm.crossReferences');
