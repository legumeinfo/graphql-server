import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    IntermineAnnotatable,
    graphqlAnnotatableAttributes,
    intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const intermineTraitAttributes = [
    ...intermineAnnotatableAttributesFactory('Trait'),
    'Trait.description',
    'Trait.name',
    'Trait.dataSet.name',
    'Trait.organism.taxonId',
    'Trait.gwas.primaryIdentifier',
];
export const intermineTraitSort = 'Trait.name';
export type IntermineTrait = [
    ...IntermineAnnotatable,
    string,
    string,
    string,
    string,
    string,
];

export const graphqlTraitAttributes = [
    ...graphqlAnnotatableAttributes,
    'description',
    'name',
    'dataSetName',
    'organismTaxonId',
    'gwasIdentifier',
];
export type GraphQLTrait = {
    [prop in typeof graphqlTraitAttributes[number]]: string;
}

export type IntermineTraitResponse = IntermineDataResponse<IntermineTrait>;
export function response2traits(response: IntermineTraitResponse): Array<GraphQLTrait> {
    return response2graphqlObjects(response, graphqlTraitAttributes);
}
