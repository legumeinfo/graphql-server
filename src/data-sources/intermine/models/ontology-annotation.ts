import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="OntologyAnnotation" is-interface="true" term="http://semanticscience.org/resource/SIO_001166">
// 	<attribute name="qualifier" type="java.lang.String" term="http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl//C41009"/>
// 	<reference name="subject" referenced-type="Annotatable" reverse-reference="ontologyAnnotations" term=""/>
// 	<reference name="ontologyTerm" referenced-type="OntologyTerm" reverse-reference="ontologyAnnotations"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// 	<collection name="evidence" referenced-type="OntologyEvidence"/>
// </class>
export const intermineOntologyAnnotationAttributes = [
    'OntologyAnnotation.id',
    'OntologyAnnotation.qualifier',
    'OntologyAnnotation.ontologyTerm.id',
];
export const intermineOntologyAnnotationSort = 'OntologyAnnotation.id';
export type IntermineOntologyAnnotation = [
  number,
  string,
  number,
];


// type OntologyAnnotation {
//   id: ID!
//   qualifier: String
//   # subject: Annotatable
//   ontologyTerm: OntologyTerm
//   # dataSets: [DataSet]
//   # evidence: [OntologyEvidence]
// }
export const graphqlOntologyAnnotationAttributes = [
    'id',
    'qualifier',
    'ontologyTermId',
];
export type GraphQLOntologyAnnotation = {
  [prop in typeof graphqlOntologyAnnotationAttributes[number]]: string;
}


export type IntermineOntologyAnnotationResponse = Response<IntermineOntologyAnnotation>;
export function response2ontologyAnnotations(response: IntermineOntologyAnnotationResponse): Array<GraphQLOntologyAnnotation> {
    return response2graphqlObjects(response, graphqlOntologyAnnotationAttributes);
}


// OntologyAnnotation.dataSets has no reverse reference
export const intermineOntologyAnnotationDataSetAttributes = [
    'OntologyAnnotation.dataSets.id',
    'OntologyAnnotation.dataSets.description',
    'OntologyAnnotation.dataSets.licence',
    'OntologyAnnotation.dataSets.url',
    'OntologyAnnotation.dataSets.name',
    'OntologyAnnotation.dataSets.version',
    'OntologyAnnotation.dataSets.synopsis',
    'OntologyAnnotation.dataSets.publication.id',  // internal resolution of publication
];
export const intermineOntologyAnnotationDataSetSort = 'OntologyAnnotation.dataSets.name'; // guaranteed not null
export type IntermineOntologyAnnotationDataSet = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
];
