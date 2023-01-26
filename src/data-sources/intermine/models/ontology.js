// <class name="Ontology" is-interface="true" term="http://semanticscience.org/resource/SIO_001391">
// 	<attribute name="url" type="java.lang.String" term="http://edamontology.org/data_1052"/>
// 	<attribute name="name" type="java.lang.String" term="http://www.w3.org/2000/01/rdf-schema#label"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
const intermineOntologyAttributes = [
    'Ontology.id',
    'Ontology.url',
    'Ontology.name',
]
const intermineOntologySort = 'Ontology.name';
// type Ontology {
//   id: ID!
//   url: String
//   name: String
//   # dataSets
// }
const graphqlOntologyAttributes = [
    'id',
    'url',
    'name',
]
function response2ontologies(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlOntologyAttributes);
}

const intermineOntologyTermOntologyAttributes = [
    'OntologyTerm.ontology.id',
    'OntologyTerm.ontology.url',
    'OntologyTerm.ontology.name',
];
const intermineOntologyTermOntologySort = 'OntologyTerm.ontology.name';

module.exports = {
    intermineOntologyAttributes,
    intermineOntologySort,
    graphqlOntologyAttributes,
    response2ontologies,
    intermineOntologyTermOntologyAttributes,
    intermineOntologyTermOntologySort,
};
