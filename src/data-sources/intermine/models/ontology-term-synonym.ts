import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="OntologyTermSynonym" is-interface="true" term="http://semanticscience.org/resource/SIO_000122">
// 	<attribute name="type" type="java.lang.String" term="http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C25284"/>
// 	<attribute name="name" type="java.lang.String" term="http://edamontology.org/data_2099"/>
// </class>
export const intermineOntologyTermSynonymAttributes = [
    'OntologyTermSynonym.id',
    'OntologyTermSynonym.type', 
    'OntologyTermSynonym.name',
];
export const intermineOntologyTermSynonymSort = 'OntologyTermSynonym.name';

export type IntermineOntologyTermSynonym = [
    number,  // id
    string,  // type
    string,  // name
];

export const graphqlOntologyTermSynonymAttributes = [
    'id',    // id
    'type',  // type
    'name',  // name
];

export type GraphQLOntologyTermSynonym = {
    [prop in typeof graphqlOntologyTermSynonymAttributes[number]]: string;
}

export type IntermineOntologyTermSynonymResponse = IntermineDataResponse<IntermineOntologyTermSynonym>;

export function response2ontologyTermSynonyms(response: IntermineOntologyTermSynonymResponse): Array<GraphQLOntologyTermSynonym> {
    return response2graphqlObjects(response, graphqlOntologyTermSynonymAttributes);
}
