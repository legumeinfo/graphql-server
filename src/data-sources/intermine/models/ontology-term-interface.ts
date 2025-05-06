export const intermineOntologyTermInterfaceAttributesFactory = (
  type = 'OntologyTerm',
) => [
  `${type}.id`,
  `${type}.identifier`,
  `${type}.description`,
  `${type}.obsolete`,
  `${type}.name`,
  `${type}.namespace`,
  `${type}.ontology.name`, // reference resolution
];
export const intermineOntologyTermInterfaceSortFactory = (
  type = 'OntologyTerm',
) => `${type}.identifier`;

export type IntermineOntologyTermInterface = [
  number,
  string,
  string,
  boolean,
  string,
  string,
  string,
];

export const graphqlOntologyTermInterfaceAttributes = [
  'id',
  'identifier',
  'description',
  'obsolete',
  'name',
  'namespace',
  'ontologyName',
];
