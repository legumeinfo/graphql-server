import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';

export const intermineOntologyTermSynonymAttributesFactory = (
  type = 'OntologyTermSynonym',
) => [`${type}.id`, `${type}.type`, `${type}.name`];

export const intermineOntologyTermSynonymAttributes =
  intermineOntologyTermSynonymAttributesFactory();

export const intermineOntologyTermSynonymSortFactory = (
  type = 'OntologyTermSynonym',
) => `${type}.name`;

export const intermineOntologyTermSynonymSort =
  intermineOntologyTermSynonymSortFactory();

export type IntermineOntologyTermSynonym = [number, string, string];

export const graphqlOntologyTermSynonymAttributes = ['id', 'type', 'name'];

export type GraphQLOntologyTermSynonym = {
  [prop in (typeof graphqlOntologyTermSynonymAttributes)[number]]: string;
};

export type IntermineOntologyTermSynonymResponse =
  IntermineDataResponse<IntermineOntologyTermSynonym>;

export function response2ontologyTermSynonyms(
  response: IntermineOntologyTermSynonymResponse,
): Array<GraphQLOntologyTermSynonym> {
  return response2graphqlObjects(
    response,
    graphqlOntologyTermSynonymAttributes,
  );
}
