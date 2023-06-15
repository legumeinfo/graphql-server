import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';


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
  number,
  string,
  string,
];


// type Ontology {
//   id: ID!
//   url: String
//   name: String
//   # dataSets
// }
export const graphqlOntologyAttributes = [
    'id',
    'url',
    'name',
]
export type GraphQLOntology = {
  [prop in typeof graphqlOntologyAttributes[number]]: string;
}


export const intermineOntologyTermOntologyAttributes = [
    'OntologyTerm.ontology.id',
    'OntologyTerm.ontology.url',
    'OntologyTerm.ontology.name',
];
export const intermineOntologyTermOntologySort = 'OntologyTerm.ontology.name';
export type IntermineOntologyTermOntology = [
  number,
  string,
  string,
];


export type IntermineOntologyResponse = IntermineDataResponse<IntermineOntology>;
export type IntermineOntologyTermOntologyResponse = IntermineDataResponse<IntermineOntologyTermOntology>;
export function response2ontologies(response: IntermineOntologyResponse | IntermineOntologyTermOntologyResponse): Array<GraphQLOntology> {
    return response2graphqlObjects(response, graphqlOntologyAttributes);
}


// Ontology.dataSets has no reverse reference
// publication is often null so skipped
export const intermineOntologyDataSetAttributes = [
    'Ontology.dataSets.id',
    'Ontology.dataSets.description',
    'Ontology.dataSets.licence',
    'Ontology.dataSets.url',
    'Ontology.dataSets.name',
    'Ontology.dataSets.version',
    'Ontology.dataSets.synopsis',
];
export const intermineOntologyDataSetSort = 'Ontology.dataSets.name'; // guaranteed not null
export type IntermineOntologyDataSet = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
];
