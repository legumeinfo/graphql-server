import {
    IntermineDataResponse,
    IntermineQueryFormat,
    objectsResponse2response,
    response2graphqlObjects,
} from '../intermine.server.js';
import {
    IntermineAnnotatable,
    IntermineAnnotatableObject,
    graphqlAnnotatableAttributes,
    intermineAnnotatableAttributesFactory,
    intermineAnnotatableObjectAttributesFactory,
} from './annotatable.js';
import { GraphQLProtein } from './protein.js';
import { GraphQLProteinMatch } from './protein-match.js';
import { GraphQLSequenceFeature } from './sequence-feature.js';


export type GraphQLBioEntity =
    GraphQLSequenceFeature |
    GraphQLProtein |
    GraphQLProteinMatch;

export const intermineBioEntityQueryFormat = IntermineQueryFormat.JSON_OBJECTS;

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

export type IntermineBioEntityObject = {
    description: string,
    symbol: string,
    name: string,
    assemblyVersion: string,
    annotationVersion: string,
    secondaryIdentifier: string,
    organism: {class: string, taxonId: number},
    strain: {class: string, primaryIdentifier: string},
} & IntermineAnnotatableObject;

export const intermineBioEntityObjectAttributesFactory = (type = 'Annotatable') => [
    ...intermineAnnotatableObjectAttributesFactory(type),
    `${type}.description`,
    `${type}.symbol`,
    `${type}.name`,
    `${type}.assemblyVersion`,
    `${type}.annotationVersion`,
    `${type}.secondaryIdentifier`,
    `${type}.organism.taxonId`,
    `${type}.strain.primaryIdentifier`,
];

export const intermineBioEntityObjectAttributes = intermineBioEntityObjectAttributesFactory();

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

export type IntermineBioEntityResponse = IntermineDataResponse<IntermineBioEntityObject>;
// converts an Intermine jsonobjects response into an array of GraphQL BioEntity objects
export function response2bioEntities(response: IntermineBioEntityResponse): Array<GraphQLBioEntity> {
    const jsonResponse = objectsResponse2response(response, intermineBioEntityObjectAttributes);
    return response2graphqlObjects(jsonResponse, graphqlBioEntityAttributes);
}
