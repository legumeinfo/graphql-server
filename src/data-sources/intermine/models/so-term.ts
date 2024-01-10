// SOTerm extends OntologyTerm with no additional attributes or references
export const intermineSOTermAttributes = [
    'SOTerm.id',
    'SOTerm.identifier',
    'SOTerm.description',   
    'SOTerm.obsolete',
    'SOTerm.name',
    'SOTerm.namespace',
    'SOTerm.ontology.id', // reference resolution
]
export const intermineSOTermSort = 'SOTerm.identifier';

// use IntermineOntologyTerm
// use graphqlOntologyTermAttributes
// use GraphQLOntologyTerm
// use IntermineOntologyTermResponse

// SOTerm.relations has no reverse reference
export const intermineSOTermRelationAttributes = [
    'SOTerm.relations.id',
    'SOTerm.relations.redundant',
    'SOTerm.relations.direct',   
    'SOTerm.relations.relationship',
    'SOTerm.relations.parentTerm.id', // resolve reference
    'SOTerm.relations.childTerm.id',  // resolve reference
];
export const intermineSOTermRelationSort = 'SOTerm.relations.id';
// use IntermineOntologyRelation
// use graphqlOntologyRelationAttributes

// SOTerm.synonyms has no reverse reference
export const intermineSOTermSynonymAttributes = [
    'SOTerm.synonyms.id',
    'SOTerm.synonyms.type', 
    'SOTerm.synonyms.name',
];
export const intermineSOTermSynonymSort = 'SOTerm.synonyms.id';
// use IntermineOntologyTermSynonym
// use graphqlOntologyTermSynonymAttributes

// SOTerm.parents has no reverse reference
export const intermineSOTermParentAttributes = [
    'SOTerm.parents.id',
    'SOTerm.parents.identifier',
    'SOTerm.parents.description',   
    'SOTerm.parents.obsolete',
    'SOTerm.parents.name',
    'SOTerm.parents.namespace',
    'SOTerm.parents.ontology.id', // reference resolution
];
export const intermineSOTermParentSort = 'SOTerm.parents.identifier';
// use IntermineOntologyTerm

// SOTerm.dataSets has no reverse reference
export const intermineSOTermDataSetAttributes = [
    'SOTerm.dataSets.id',
    'SOTerm.dataSets.description',
    'SOTerm.dataSets.licence',
    'SOTerm.dataSets.url',
    'SOTerm.dataSets.name',
    'SOTerm.dataSets.version',
    'SOTerm.dataSets.synopsis',
    'SOTerm.dataSets.publication.doi',  // resolve Publication
];
export const intermineSOTermDataSetSort = 'SOTerm.dataSets.name';
// use IntermineDataSet

// SOTerm.crossReferences has no reverse reference
export const intermineSOTermCrossReferenceAttributes = [
    'SOTerm.crossReferences.id',
    'SOTerm.crossReferences.identifier',
    'SOTerm.crossReferences.description',   
    'SOTerm.crossReferences.obsolete',
    'SOTerm.crossReferences.name',
    'SOTerm.crossReferences.namespace',
    'SOTerm.crossReferences.ontology.id', // reference resolution
];
export const intermineSOTermCrossReferenceSort = 'SOTerm.crossReferences.identifier';
// use IntermineOntologyTerm
