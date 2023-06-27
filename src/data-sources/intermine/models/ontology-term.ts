import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';


// <class name="OntologyTerm" is-interface="true" term="http://semanticscience.org/resource/SIO_000275">
// 	<attribute name="identifier" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000675"/>
// 	<attribute name="description" type="java.lang.String" term="http://purl.org/dc/terms/description"/>
// 	<attribute name="obsolete" type="java.lang.Boolean" term="http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C63553"/>
// 	<attribute name="name" type="java.lang.String" term="http://www.w3.org/2000/01/rdf-schema#label"/>
// 	<attribute name="namespace" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000067"/>
// 	<reference name="ontology" referenced-type="Ontology"/>
// 	<collection name="relations" referenced-type="OntologyRelation"/>
// 	<collection name="synonyms" referenced-type="OntologyTermSynonym"/>
// 	<collection name="ontologyAnnotations" referenced-type="OntologyAnnotation" reverse-reference="ontologyTerm"/>
// 	<collection name="parents" referenced-type="OntologyTerm"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// 	<collection name="crossReferences" referenced-type="OntologyTerm"/>
// </class>
// NOTE: we can't query OntologyTerm.ontology.id here because ontology is sometimes null.
export const intermineOntologyTermAttributes = [
    'OntologyTerm.id',
    'OntologyTerm.identifier',
    'OntologyTerm.description',   
    'OntologyTerm.obsolete',
    'OntologyTerm.name',
    'OntologyTerm.namespace',
]
export const intermineOntologyTermSort = 'OntologyTerm.identifier';
export type IntermineOntologyTerm = [
  number,
  string,
  string,
  boolean,
  string,
  string,
];


// type OntologyTerm {
//   id: ID!
//   identifier: String!
//   description: String
//   obsolete: Boolean
//   name: String
//   namespace: String
//   # ontology
//   # relations
//   # synonyms
//   # ontologyAnnotations
//   # parents
//   # dataSets
//   # crossReferences
// }
export const graphqlOntologyTermAttributes = [
    'id',
    'identifier',
    'description',
    'obsolete',
    'name',
    'namespace',
];
export type GraphQLOntologyTerm = {
  [prop in typeof graphqlOntologyTermAttributes[number]]: string;
}


export type IntermineOntologyTermResponse = IntermineDataResponse<IntermineOntologyTerm>;
export function response2ontologyTerms(response: IntermineOntologyTermResponse): Array<GraphQLOntologyTerm> {
    return response2graphqlObjects(response, graphqlOntologyTermAttributes);
}


// OntologyTerm.dataSets has no reverse reference
export const intermineOntologyTermDataSetAttributes = [
    'OntologyTerm.dataSets.id',
    'OntologyTerm.dataSets.description',
    'OntologyTerm.dataSets.licence',
    'OntologyTerm.dataSets.url',
    'OntologyTerm.dataSets.name',
    'OntologyTerm.dataSets.version',
    'OntologyTerm.dataSets.synopsis',
    'OntologyTerm.dataSets.publication.doi',  // internal resolution of publication
];
export const intermineOntologyTermDataSetSort = 'OntologyTerm.dataSets.name'; // guaranteed not null
export type IntermineOntologyTermDataSet = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];
