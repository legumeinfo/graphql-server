// <class name="QTLStudy" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="genotypes" type="java.lang.String"/>
// 	<attribute name="synopsis" type="java.lang.String"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="qtlStudy"/>
// </class>
export const intermineQTLStudyAttributes = [
    'QTLStudy.id',
    'QTLStudy.primaryIdentifier',
    'QTLStudy.description',
    'QTLStudy.genotypes',
    'QTLStudy.synopsis',
    'QTLStudy.organism.id',
    'QTLStudy.dataSet.id',
];
export const intermineQTLStudySort = 'QTLStudy.primaryIdentifier';


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
export const graphqlQTLStudyAttributes = [
    'id',
    'identifier',
    'description',
    'genotypes',
    'synopsis',
    'organismId',
    'dataSetId',
];


export function response2qtlStudies(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlQTLStudyAttributes);
}
