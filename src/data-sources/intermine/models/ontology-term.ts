import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
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

export const intermineOntologyTermAttributes = [
  ...intermineOntologyTermInterfaceAttributesFactory('OntologyTerm'),
];
export const intermineOntologyTermSort =
  intermineOntologyTermInterfaceSortFactory('OntologyTerm');

export type IntermineOntologyTerm = [...IntermineOntologyTermInterface];

export const graphqlOntologyTermAttributes = [
  ...graphqlOntologyTermInterfaceAttributes,
];

export type GraphQLOntologyTerm = {
  [prop in (typeof graphqlOntologyTermAttributes)[number]]: string;
};

export type IntermineOntologyTermResponse =
  IntermineDataResponse<IntermineOntologyTerm>;

export function response2ontologyTerms(
  response: IntermineOntologyTermResponse,
): Array<GraphQLOntologyTerm> {
  return response2graphqlObjects(response, graphqlOntologyTermAttributes);
}

// OntologyTerm.crossReferences has no reverse reference
export const intermineOntologyTermCrossReferenceAttributes =
  intermineOntologyTermInterfaceAttributesFactory(
    'OntologyTerm.crossReferences',
  );
export const intermineOntologyTermCrossReferenceSort =
  intermineOntologyTermInterfaceSortFactory('OntologyTerm.crossReferences');

// OntologyTerm.dataSets has no reverse reference
export const intermineOntologyTermDataSetAttributes =
  intermineDataSetAttributesFactory('OntologyTerm.dataSets');
export const intermineOntologyTermDataSetSort = intermineDataSetSortFactory(
  'OntologyTerm.dataSets',
);

// OntologyTerm.ontology does not have an Ontology reverse reference
export const intermineOntologyTermOntologyAttributes =
  intermineOntologyAttributesFactory('OntologyTerm.ontology');
export const intermineOntologyTermOntologySort = intermineOntologySortFactory(
  'OntologyTerm.ontology',
);

// OntologyTerm.parents has no reverse reference
export const intermineOntologyTermParentAttributes =
  intermineOntologyTermInterfaceAttributesFactory('OntologyTerm.paranets');
export const intermineOntologyTermParentSort =
  intermineOntologyTermInterfaceSortFactory('OntologyTerm.parents');

// OntologyTerm.relations has no reverse reference from OntologyRelation
export const intermineOntologyTermRelationAttributes =
  intermineOntologyRelationAttributesFactory('OntologyTerm.relations');
export const intermineOntologyTermRelationSort =
  intermineOntologyRelationSortFactory('OntologyTerm.relations');

// OntologyTerm.synonyms has no reverse reference from OntologyTermSynonym
export const intermineOntologyTermOntologyTermSynonymAttributes =
  intermineOntologyTermSynonymAttributesFactory('OntologyTerm.synonyms');
export const intermineOntologyTermOntologyTermSynonymSort =
  intermineOntologyTermSynonymSortFactory('OntologyTerm.synonym');
