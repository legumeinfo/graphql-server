import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  intermineDataSetAttributesFactory,
  intermineDataSetSortFactory,
} from './data-set.js';
import {
  intermineOntologyAttributesFactory,
  intermineOntologySortFactory,
} from './ontology.js';
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

// SOTerm.crossReferences has no reverse reference
export const intermineSequenceOntologyTermCrossReferenceAttributes = intermineOntologyTermInterfaceAttributesFactory('SOTerm.crossReferences');
export const intermineSequenceOntologyTermCrossReferenceSort = intermineOntologyTermInterfaceSortFactory('SOTerm.crossReferences');

// SOTerm.dataSets has no reverse reference
export const intermineSequenceOntologyTermDataSetAttributes = intermineDataSetAttributesFactory('SOTerm.dataSets');
export const intermineSequenceOntologyTermDataSetSort = intermineDataSetSortFactory('SOTerm.dataSets');

// SOTerm.ontology does not have an Ontology reverse reference
export const intermineSequenceOntologyTermOntologyAttributes = intermineOntologyAttributesFactory('SOTerm.ontology');
export const intermineSequenceOntologyTermOntologySort = intermineOntologySortFactory('SOTerm.ontology');

// SOTerm.parents has no reverse reference
export const intermineSequenceOntologyTermParentAttributes = intermineOntologyTermInterfaceAttributesFactory('SOTerm.parents');
export const intermineSequenceOntologyTermParentSort = intermineOntologyTermInterfaceSortFactory('SOTerm.parents');

// SOTerm.relations has no reverse reference
export const intermineSequenceOntologyTermRelationAttributes = intermineOntologyRelationAttributesFactory('SOTerm.relations');
export const intermineSequenceOntologyTermRelationSort = intermineOntologyRelationSortFactory('SOTerm.relations');

// SOTerm.synonyms has no reverse reference
export const intermineSequenceOntologyTermSynonymAttributes = intermineOntologyTermSynonymAttributesFactory('SOTerm.synonyms');
export const intermineSequenceOntologyTermSynonymSort = intermineOntologyTermSynonymSortFactory('SOTerm.synonyms');
