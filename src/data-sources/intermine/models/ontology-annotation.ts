import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="OntologyAnnotation" is-interface="true" term="http://semanticscience.org/resource/SIO_001166">
// 	<attribute name="qualifier" type="java.lang.String" term="http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl//C41009"/>
// 	<reference name="subject" referenced-type="Annotatable" reverse-reference="ontologyAnnotations" term=""/>
// 	<reference name="ontologyTerm" referenced-type="OntologyTerm" reverse-reference="ontologyAnnotations"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// 	<collection name="evidence" referenced-type="OntologyEvidence"/>
// </class>
// Note: qualifier and evidence are not currently populated in LIS mines
export const intermineOntologyAnnotationAttributes = [
    'OntologyAnnotation.id',
    'OntologyAnnotation.subject.id',              // resolve reference
    'OntologyAnnotation.ontologyTerm.identifier', // resolve reference
];
export const intermineOntologyAnnotationSort = 'OntologyAnnotation.ontologyTerm.identifier';

export type IntermineOntologyAnnotation = [
    number, // id
    number, // subject.id
    string, // ontologyTerm.identifier
];

export const graphqlOntologyAnnotationAttributes = [
    'id',                     // id
    'subjectId',              // subject.id
    'ontologyTermIdentifier', // ontologyTerm.identifier
];

export type GraphQLOntologyAnnotation = {
    [prop in typeof graphqlOntologyAnnotationAttributes[number]]: string;
}

export type IntermineOntologyAnnotationResponse = IntermineDataResponse<IntermineOntologyAnnotation>;

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
    'OntologyAnnotation.dataSets.publication.doi',  // resolve reference
]
export const intermineOntologyAnnotationDataSetSort = 'OntologyAnnotation.dataSets.name';
// use IntermineDataSet
