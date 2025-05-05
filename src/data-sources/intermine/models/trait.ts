import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    IntermineAnnotatable,
    graphqlAnnotatableAttributes,
    intermineAnnotatableAttributesFactory,
} from './annotatable.js';

export const intermineTraitAttributesFactory = (type = 'Trait') => [
    ...intermineAnnotatableAttributesFactory(type),
    `${type}.description`,
    `${type}.name`,
    //adf: TODO; including these attributes breaks the gene function use case currently but may need to revisit later
    //`${type}.dataSets.name`,
    //`${type}.organism.taxonId`,
    //`${type}.gwas.primaryIdentifier`,
];
export const intermineTraitAttributes = intermineTraitAttributesFactory('Trait');

export const intermineTraitSortFactory = (type = 'Trait') => `${type}.name`;
export const intermineTraitSort = intermineTraitSortFactory();
//export const intermineTraitSort = 'Trait.name';
export type IntermineTrait = [
    ...IntermineAnnotatable,
    string,
    string,
    //adf: TODO; including these attributes breaks the gene function use case currently but may need to revisit later
    //string,
    //string,
    //string,
];

export const graphqlTraitAttributes = [
    ...graphqlAnnotatableAttributes,
    'description',
    'name',
    //adf: TODO; including these attributes breaks the gene function use case currently but may need to revisit later
    //'dataSetsName',
    //'organismTaxonId',
    //'gwasIdentifier',
];
export type GraphQLTrait = {
    [prop in typeof graphqlTraitAttributes[number]]: string;
}

export type IntermineTraitResponse = IntermineDataResponse<IntermineTrait>;
export function response2traits(response: IntermineTraitResponse): Array<GraphQLTrait> {
    return response2graphqlObjects(response, graphqlTraitAttributes);
}
