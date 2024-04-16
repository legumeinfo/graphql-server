import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  intermineDataSetAttributesFactory,
  intermineDataSetSortFactory,
} from './data-set.js';
import {
  intermineOntologyRelationAttributesFactory,
  intermineOntologyRelationSortFactory,
} from './ontology-relation.js';
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
export const intermineSequenceOntologyTermRelationAttributes = intermineOntologyRelationAttributesFactory('SOTerm.relations');
export const intermineSequenceOntologyTermRelationSort = intermineOntologyRelationSortFactory('SOTerm.relations');

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
