// <class name="QTLStudy" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="genotypes" type="java.lang.String"/>
// 	<attribute name="synopsis" type="java.lang.String"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="qtlStudy"/>
// </class>
const intermineQTLStudyAttributes = [
    'QTLStudy.id',
    'QTLStudy.primaryIdentifier',
    'QTLStudy.description',
    'QTLStudy.genotypes',
    'QTLStudy.synopsis',
    'QTLStudy.organism.taxonId',
    'QTLStudy.dataSet.id',
];

const intermineQTLStudySort = 'QTLStudy.primaryIdentifier';

// type QTLStudy {
//   id: ID!
//   identifier: String!
//   # ontologyAnnotations
//   # publications
//   description: String
//   genotypes: String
//   synopsis: String
//   organism: Organism
//   dataSet: DataSet
//   qtls: [QTL]
// }
const graphqlQTLStudyAttributes = [
    'id',
    'identifier',
    'description',
    'genotypes',
    'synopsis',
    'organismTaxonId',
    'dataSetId',
];

function response2qtlStudies(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlQTLStudyAttributes);
}


module.exports = {
    intermineQTLStudyAttributes,
    intermineQTLStudySort,
    graphqlQTLStudyAttributes,
    response2qtlStudies,
};

