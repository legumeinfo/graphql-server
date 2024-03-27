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
export const intermineOntologyTermAttributes = [
    'OntologyTerm.id',
    'OntologyTerm.identifier',
    'OntologyTerm.description',
    'OntologyTerm.obsolete',
    'OntologyTerm.name',
    'OntologyTerm.namespace',
    'OntologyTerm.ontology.name', // reference resolution
]
export const intermineOntologyTermSort = 'OntologyTerm.identifier';

export type IntermineOntologyTerm = [
    number,  // id
    string,  // identifier
    string,  // description
    boolean, // obsolete
    string,  // name
    string,  // namespace
    string,  // ontology.name
];

export const graphqlOntologyTermAttributes = [
    'id',           // id
    'identifier',   // identifier
    'description',  // description
    'obsolete',     // obsolete
    'name',         // name
    'namespace',    // namespace
    'ontologyName', // Ontology.name
];

export type GraphQLOntologyTerm = {
    [prop in typeof graphqlOntologyTermAttributes[number]]: string;
}

export type IntermineOntologyTermResponse = IntermineDataResponse<IntermineOntologyTerm>;

export function response2ontologyTerms(response: IntermineOntologyTermResponse): Array<GraphQLOntologyTerm> {
    return response2graphqlObjects(response, graphqlOntologyTermAttributes);
}

// OntologyTerm.synonyms has no reverse reference from OntologyTermSynonym
export const intermineOntologyTermOntologyTermSynonymAttributes = [
    'OntologyTerm.synonyms.id',
    'OntologyTerm.synonyms.type',
    'OntologyTerm.synonyms.name',
];
export const intermineOntologyTermOntologyTermSynonymSort = 'OntologyTerm.synonym.name';

// OntologyTerm.relations has no reverse reference from OntologyRelation
export const intermineOntologyTermRelationAttributes = [
    'OntologyTerm.relations.id',
    'OntologyTerm.relations.redundant',
    'OntologyTerm.relations.direct',
    'OntologyTerm.relations.relationship',
    'OntologyTerm.relations.parentTerm.id', // resolve reference
    'OntologyTerm.relations.childTerm.id',  // resolve reference
];
export const intermineOntologyTermRelationSort = 'OntologyTerm.relations.id';

// OntologyTerm.ontology does not have an Ontology reverse reference
export const intermineOntologyTermOntologyAttributes = [
    'OntologyTerm.ontology.id',
    'OntologyTerm.ontology.url',
    'OntologyTerm.ontology.name',
];
export const intermineOntologyTermOntologySort = 'OntologyTerm.ontology.name';
// use IntermineOntologyTerm

// OntologyTerm.parents has no reverse reference
export const intermineOntologyTermParentAttributes = [
    'OntologyTerm.parents.id',
    'OntologyTerm.parents.identifier',
    'OntologyTerm.parents.description',
    'OntologyTerm.parents.obsolete',
    'OntologyTerm.parents.name',
    'OntologyTerm.parents.namespace',
    'OntologyTerm.parents.ontology.id', // reference resolution
];
export const intermineOntologyTermParentSort = 'OntologyTerm.parents.identifier';
// use IntermineOntologyTerm

// OntologyTerm.dataSets has no reverse reference
export const intermineOntologyTermDataSetAttributes = [
    'OntologyTerm.dataSets.id',
    'OntologyTerm.dataSets.description',
    'OntologyTerm.dataSets.licence',
    'OntologyTerm.dataSets.url',
    'OntologyTerm.dataSets.name',
    'OntologyTerm.dataSets.version',
    'OntologyTerm.dataSets.synopsis',
    'OntologyTerm.dataSets.dataSource.name',  // resolve reference
    'OntologyTerm.dataSets.publication.doi',  // resolve reference
];
export const intermineOntologyTermDataSetSort = 'OntologyTerm.dataSets.name';
// use IntermineDataSet

// OntologyTerm.crossReferences has no reverse reference
export const intermineOntologyTermCrossReferenceAttributes = [
    'OntologyTerm.crossReferences.id',
    'OntologyTerm.crossReferences.identifier',
    'OntologyTerm.crossReferences.description',
    'OntologyTerm.crossReferences.obsolete',
    'OntologyTerm.crossReferences.name',
    'OntologyTerm.crossReferences.namespace',
    'OntologyTerm.crossReferences.ontology.id', // reference resolution
];
export const intermineOntologyTermCrossReferenceSort = 'OntologyTerm.crossReferences.identifier';
// use IntermineOntologyTerm
