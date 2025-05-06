import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  intermineDataSetAttributesFactory,
  intermineDataSetSortFactory,
} from './data-set.js';

export const intermineOntologyAnnotationAttributes = [
  'OntologyAnnotation.id',
  'OntologyAnnotation.qualifier',
  'OntologyAnnotation.ontologyTerm.identifier',
];
export const intermineOntologyAnnotationSort = 'OntologyAnnotation.id';
export type IntermineOntologyAnnotation = [number, string, number];

export const graphqlOntologyAnnotationAttributes = [
  'id',
  'qualifier',
  'ontologyTermIdentifier',
];
export type GraphQLOntologyAnnotation = {
  [prop in (typeof graphqlOntologyAnnotationAttributes)[number]]: string;
};

export type IntermineOntologyAnnotationResponse =
  IntermineDataResponse<IntermineOntologyAnnotation>;
export function response2ontologyAnnotations(
  response: IntermineOntologyAnnotationResponse,
): Array<GraphQLOntologyAnnotation> {
  return response2graphqlObjects(response, graphqlOntologyAnnotationAttributes);
}

// OntologyAnnotation.dataSets has no reverse reference
export const intermineOntologyAnnotationDataSetAttributes =
  intermineDataSetAttributesFactory('OntologyAnnotation.dataSets.id');
export const intermineOntologyAnnotationDataSetSort =
  intermineDataSetSortFactory('OntologyAnnotation.dataSets');
