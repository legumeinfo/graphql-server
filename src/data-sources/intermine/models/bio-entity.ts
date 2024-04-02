import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';
import { GraphQLProtein } from './protein.js';
import { GraphQLProteinMatch } from './protein-match.js';
import { GraphQLSequenceFeature } from './sequence-feature.js';


export type GraphQLBioEntity =
  GraphQLSequenceFeature |
  GraphQLProtein |
  GraphQLProteinMatch;

export const intermineBioEntityAttributesFactory = (type = 'BioEntity') => [
    ...intermineAnnotatableAttributesFactory(type),
    `${type}.description`,
    `${type}.symbol`,
    `${type}.name`,
    `${type}.assemblyVersion`,
    `${type}.annotationVersion`,
    `${type}.secondaryIdentifier`,
    `${type}.organism.taxonId`,
    `${type}.strain.identifier`,
];


export type IntermineBioEntity = [
    ...IntermineAnnotatable,
    string,
    string,
    string,
    string,
    string,
    string,
    number,
    string,
];

export const graphqlBioEntityAttributes = [
    ...graphqlAnnotatableAttributes,
    'description',
    'symbol',
    'name',
    'assemblyVersion',
    'annotationVersion',
    'secondaryIdentifier',
    'organismTaxonId',
    'strainIdentifier',
];
