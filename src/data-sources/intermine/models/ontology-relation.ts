import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="OntologyRelation" is-interface="true">
// 	<attribute name="redundant" type="java.lang.Boolean"/>
// 	<attribute name="direct" type="java.lang.Boolean"/>
// 	<attribute name="relationship" type="java.lang.String"/>
// 	<reference name="parentTerm" referenced-type="OntologyTerm"/>
// 	<reference name="childTerm" referenced-type="OntologyTerm"/>
// </class>
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
    number,  // id
    boolean, // redundant
    boolean, // direct
    string,  // relationship
    number,  // parentTerm.id
    number,  // childTerm.id
];

export const graphqlOntologyRelationAttributes = [
    'id',           // id
    'redundant',    // redundant
    'direct',       // direct
    'relationship', // relationship
    'parentTermId', // resolve parentTerm
    'childTermId',  // resolve childTerm
];

export type GraphQLOntologyRelation = {
    [prop in typeof graphqlOntologyRelationAttributes[number]]: string;
}

export type IntermineOntologyRelationResponse = IntermineDataResponse<IntermineOntologyRelation>;

export function response2ontologyRelations(response: IntermineOntologyRelationResponse): Array<GraphQLOntologyRelation> {
    return response2graphqlObjects(response, graphqlOntologyRelationAttributes);
}
