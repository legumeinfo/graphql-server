import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';

// Base attributes - core trait fields without relationship-dependent attributes
// Use this for contexts where related entities may not exist (e.g., GeneFunction -> Traits)
export const intermineTraitBaseAttributesFactory = (type = 'Trait') => [
  ...intermineAnnotatableAttributesFactory(type),
  `${type}.description`,
  `${type}.name`,
];
export const intermineTraitBaseAttributes =
  intermineTraitBaseAttributesFactory('Trait');

// Extended attributes - includes eager-loaded relationship data
// Use with OUTER joins for direct trait queries where relationships may be null
export const intermineTraitAttributesFactory = (type = 'Trait') => [
  ...intermineTraitBaseAttributesFactory(type),
  `${type}.dataSets.name`,
  `${type}.organism.taxonId`,
  `${type}.gwas.primaryIdentifier`,
];
export const intermineTraitAttributes =
  intermineTraitAttributesFactory('Trait');

export const intermineTraitSortFactory = (type = 'Trait') => `${type}.name`;
export const intermineTraitSort = intermineTraitSortFactory();

// Type for base attributes response
export type IntermineTraitBase = [...IntermineAnnotatable, string, string];

// Type for extended attributes response (includes nullable relationship fields)
export type IntermineTrait = [
  ...IntermineAnnotatable,
  string,
  string,
  string | null,
  number | null,
  string | null,
];

// Base GraphQL attributes
export const graphqlTraitBaseAttributes = [
  ...graphqlAnnotatableAttributes,
  'description',
  'name',
];

// Extended GraphQL attributes
export const graphqlTraitAttributes = [
  ...graphqlTraitBaseAttributes,
  'dataSetsName',
  'organismTaxonId',
  'gwasIdentifier',
];

export type GraphQLTrait = {
  [prop in (typeof graphqlTraitAttributes)[number]]: string;
};

export type IntermineTraitBaseResponse =
  IntermineDataResponse<IntermineTraitBase>;
export type IntermineTraitResponse = IntermineDataResponse<IntermineTrait>;

// Response converter for base attributes
export function response2traitsBase(
  response: IntermineTraitBaseResponse,
): Array<GraphQLTrait> {
  return response2graphqlObjects(response, graphqlTraitBaseAttributes);
}

// Response converter for extended attributes
export function response2traits(
  response: IntermineTraitResponse,
): Array<GraphQLTrait> {
  return response2graphqlObjects(response, graphqlTraitAttributes);
}
