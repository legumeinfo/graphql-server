// <class name="OntologyAnnotation" is-interface="true" term="http://semanticscience.org/resource/SIO_001166">
// 	<attribute name="qualifier" type="java.lang.String" term="http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl//C41009"/>
// 	<reference name="subject" referenced-type="Annotatable" reverse-reference="ontologyAnnotations" term=""/>
// 	<reference name="ontologyTerm" referenced-type="OntologyTerm" reverse-reference="ontologyAnnotations"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// 	<collection name="evidence" referenced-type="OntologyEvidence"/>
// </class>
const intermineOntologyAnnotationAttributes = [
    'OntologyAnnotation.id',
    'OntologyAnnotation.qualifier',
    'OntologyAnnotation.ontologyTerm.id',
];
const intermineOntologyAnnotationSort = 'OntologyAnnotation.id';

// type OntologyAnnotation {
//   id: ID!
//   qualifier: String
//   # subject: Annotatable
//   ontologyTerm: OntologyTerm
//   # dataSets: [DataSet]
//   # evidence: [OntologyEvidence]
// }
const graphqlOntologyAnnotationAttributes = [
    'id',
    'qualifier',
    'ontologyTermId',
];

function response2ontologyAnnotations(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlOntologyAnnotationAttributes);
}

// OntologyAnnotation.dataSets has no reverse reference
const intermineOntologyAnnotationDataSetAttributes = [
    'OntologyAnnotation.dataSets.id',
    'OntologyAnnotation.dataSets.description',
    'OntologyAnnotation.dataSets.licence',
    'OntologyAnnotation.dataSets.url',
    'OntologyAnnotation.dataSets.name',
    'OntologyAnnotation.dataSets.version',
    'OntologyAnnotation.dataSets.synopsis',
    'OntologyAnnotation.dataSets.publication.id',  // internal resolution of publication
];
const intermineOntologyAnnotationDataSetSort = 'OntologyAnnotation.dataSets.name'; // guaranteed not null


module.exports = {
    intermineOntologyAnnotationAttributes,
    intermineOntologyAnnotationSort,
    graphqlOntologyAnnotationAttributes,
    response2ontologyAnnotations,

    intermineOntologyAnnotationDataSetAttributes,
    intermineOntologyAnnotationDataSetSort,
};
