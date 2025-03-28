import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

export const intermineOntologyRelationAttributesFactory = (type = 'OntologyTermRelation') => [
    `${type}.id`,
    `${type}.redundant`,
    `${type}.direct`,
    `${type}.relationship`,
    `${type}.parentTerm.id`, // resolve reference
    `${type}.childTerm.id`,  // resolve reference
];

export const intermineOntologyRelationAttributes = intermineOntologyRelationAttributesFactory();

export const intermineOntologyRelationSortFactory = (type = 'OntologyTermRelation') => `${type}.id`;

export const intermineOntologyRelationSort = intermineOntologyRelationSortFactory();

export type IntermineOntologyRelation = [
    number,
    boolean,
    boolean,
    string,
    number,
    number,
];

export const graphqlOntologyRelationAttributes = [
    'id',
    'redundant',
    'direct',
    'relationship',
    'parentTermId',
    'childTermId',
];

export type GraphQLOntologyRelation = {
    [prop in typeof graphqlOntologyRelationAttributes[number]]: string;
}

export type IntermineOntologyRelationResponse = IntermineDataResponse<IntermineOntologyRelation>;

export function response2ontologyRelations(response: IntermineOntologyRelationResponse): Array<GraphQLOntologyRelation> {
    return response2graphqlObjects(response, graphqlOntologyRelationAttributes);
}
