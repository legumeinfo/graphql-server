import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  intermineDataSetAttributesFactory,
  intermineDataSetSortFactory,
} from './data-set.js';

// <class name="Ontology" is-interface="true" term="http://semanticscience.org/resource/SIO_001391">
// 	<attribute name="url" type="java.lang.String" term="http://edamontology.org/data_1052"/>
// 	<attribute name="name" type="java.lang.String" term="http://www.w3.org/2000/01/rdf-schema#label"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const intermineOntologyAttributes = [
    'Ontology.id',
    'Ontology.url',
    'Ontology.name',
]
export const intermineOntologySort = 'Ontology.name';

export type IntermineOntology = [
  number, // id
  string, // url
  string, // name
];

export const graphqlOntologyAttributes = [
    'id',   // id
    'url',  // url
    'name', // name
]

export type GraphQLOntology = {
  [prop in typeof graphqlOntologyAttributes[number]]: string;
}

export type IntermineOntologyResponse = IntermineDataResponse<IntermineOntology>;

// converts an Intermine response into an array of GraphQLOntology objects
export function response2ontologies(response: IntermineOntologyResponse): Array<GraphQLOntology> {
    return response2graphqlObjects(response, graphqlOntologyAttributes);
}

// Ontology.dataSets does not have a reverse reference
export const intermineOntologyDataSetAttributes = intermineDataSetAttributesFactory('Ontology.dataSets');
export const intermineOntologyDataSetSort = intermineDataSetSortFactory('Ontology.dataSets');
