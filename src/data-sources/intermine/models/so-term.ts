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

// SOTerm.dataSets has no reverse reference
export const intermineSOTermDataSetAttributes = [
    'SOTerm.dataSets.id',
    'SOTerm.dataSets.description',
    'SOTerm.dataSets.licence',
    'SOTerm.dataSets.url',
    'SOTerm.dataSets.name',
    'SOTerm.dataSets.version',
    'SOTerm.dataSets.synopsis',
    'SOTerm.dataSets.publication.doi',  // internal resolution of publication
];
export const intermineSOTermDataSetSort = 'SOTerm.dataSets.name'; // guaranteed not null
// use IntermineOntologyTermDataSet
