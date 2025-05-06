import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  intermineDataSetAttributesFactory,
  intermineDataSetSortFactory,
} from './data-set.js';

export const intermineOntologyAttributesFactory = (type = 'Ontology') => [
  `${type}.id`,
  `${type}.url`,
  `${type}.name`,
];

export const intermineOntologyAttributes = intermineOntologyAttributesFactory();

export const intermineOntologySortFactory = (type = 'Ontology') =>
  `${type}.name`;

export const intermineOntologySort = intermineOntologySortFactory();

export type IntermineOntology = [number, string, string];

export const graphqlOntologyAttributes = ['id', 'url', 'name'];

export type GraphQLOntology = {
  [prop in (typeof graphqlOntologyAttributes)[number]]: string;
};

export type IntermineOntologyResponse =
  IntermineDataResponse<IntermineOntology>;

// converts an Intermine response into an array of GraphQLOntology objects
export function response2ontologies(
  response: IntermineOntologyResponse,
): Array<GraphQLOntology> {
  return response2graphqlObjects(response, graphqlOntologyAttributes);
}

// Ontology.dataSets does not have a reverse reference
export const intermineOntologyDataSetAttributes =
  intermineDataSetAttributesFactory('Ontology.dataSets');
export const intermineOntologyDataSetSort =
  intermineDataSetSortFactory('Ontology.dataSets');
