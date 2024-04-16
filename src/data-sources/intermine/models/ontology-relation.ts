import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

export const intermineOntologyRelationAttributes = [
    'OntologyTermRelation.id',
    'OntologyTermRelation.redundant',
    'OntologyTermRelation.direct',   
    'OntologyTermRelation.relationship',
    'OntologyTermRelation.parentTerm.id', // resolve reference
    'OntologyTermRelation.childTerm.id',  // resolve reference
];
export const intermineOntologyRelationSort = 'OntologyTermRelation.id';

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
