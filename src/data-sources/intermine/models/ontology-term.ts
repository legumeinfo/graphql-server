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

export const intermineOntologyTermAttributes = [
    ...intermineOntologyTermInterfaceAttributesFactory('OntologyTerm'),
]
export const intermineOntologyTermSort = intermineOntologyTermInterfaceSortFactory('OntologyTerm');

export type IntermineOntologyTerm = [
    ...IntermineOntologyTermInterface,
];

export const graphqlOntologyTermAttributes = [
    ...graphqlOntologyTermInterfaceAttributes,
];

export type GraphQLOntologyTerm = {
    [prop in typeof graphqlOntologyTermAttributes[number]]: string;
}

export type IntermineOntologyTermResponse = IntermineDataResponse<IntermineOntologyTerm>;

export function response2ontologyTerms(response: IntermineOntologyTermResponse): Array<GraphQLOntologyTerm> {
    return response2graphqlObjects(response, graphqlOntologyTermAttributes);
}

// OntologyTerm.synonyms has no reverse reference from OntologyTermSynonym
export const intermineOntologyTermOntologyTermSynonymAttributes = [
    'OntologyTerm.synonyms.id',
    'OntologyTerm.synonyms.type',
    'OntologyTerm.synonyms.name',
];
export const intermineOntologyTermOntologyTermSynonymSort = 'OntologyTerm.synonym.name';

// OntologyTerm.relations has no reverse reference from OntologyRelation
export const intermineOntologyTermRelationAttributes = [
    'OntologyTerm.relations.id',
    'OntologyTerm.relations.redundant',
    'OntologyTerm.relations.direct',
    'OntologyTerm.relations.relationship',
    'OntologyTerm.relations.parentTerm.id', // resolve reference
    'OntologyTerm.relations.childTerm.id',  // resolve reference
];
export const intermineOntologyTermRelationSort = 'OntologyTerm.relations.id';

// OntologyTerm.ontology does not have an Ontology reverse reference
export const intermineOntologyTermOntologyAttributes = [
    'OntologyTerm.ontology.id',
    'OntologyTerm.ontology.url',
    'OntologyTerm.ontology.name',
];
export const intermineOntologyTermOntologySort = 'OntologyTerm.ontology.name';
// use IntermineOntologyTerm

// OntologyTerm.parents has no reverse reference
export const intermineOntologyTermParentAttributes = intermineOntologyTermInterfaceAttributesFactory('OntologyTerm.paranets');
export const intermineOntologyTermParentSort = intermineOntologyTermInterfaceSortFactory('OntologyTerm.parents');

// OntologyTerm.dataSets has no reverse reference
export const intermineOntologyTermDataSetAttributes = intermineDataSetAttributesFactory('OntologyTerm.dataSets.id');
export const intermineOntologyTermDataSetSort = intermineDataSetSortFactory('OntologyTerm.dataSets');

// OntologyTerm.crossReferences has no reverse reference
export const intermineOntologyTermCrossReferenceAttributes = intermineOntologyTermInterfaceAttributesFactory('OntologyTerm.crossReferences');
export const intermineOntologyTermCrossReferenceSort = intermineOntologyTermInterfaceSortFactory('OntologyTerm.crossReferences');
