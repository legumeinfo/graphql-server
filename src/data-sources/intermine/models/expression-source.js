// <class name="ExpressionSource" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="sra" type="java.lang.String"/>
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="bioProject" type="java.lang.String"/>
// 	<attribute name="unit" type="java.lang.String"/>
// 	<attribute name="geoSeries" type="java.lang.String"/>
// 	<attribute name="synopsis" type="java.lang.String"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<reference name="strain" referenced-type="Strain"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="samples" referenced-type="ExpressionSample" reverse-reference="source"/>
// </class>
const intermineExpressionSourceAttributes = [
    'ExpressionSource.id',
    'ExpressionSource.primaryIdentifier',
    'ExpressionSource.sra',
    'ExpressionSource.description',
    'ExpressionSource.bioProject',
    'ExpressionSource.unit',
    'ExpressionSource.geoSeries',
    'ExpressionSource.synopsis',
    'ExpressionSource.organism.id',
    'ExpressionSource.strain.id',
    'ExpressionSource.dataSet.id',
];
const intermineExpressionSourceSort = 'ExpressionSource.primaryIdentifier';

// type ExpressionSource {
//   id: ID!
//   identifier: String!
//   # ontologyAnnotations
//   # publications
//   sra: String
//   description: String
//   bioProject: String
//   unit: String
//   geoSeries: String
//   synopsis: String
//   organism: Organism
//   strain: Strain
//   dataSet: DataSet
//   samples: [ExpressionSample]
// }
const graphqlExpressionSourceAttributes = [
    'id',
    'identifier',
    'sra',
    'description',
    'bioProject',
    'unit',
    'geoSeries',
    'synopsis',
    'organismId',
    'strainId',
    'dataSetId',
];

function response2expressionSources(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlExpressionSourceAttributes);
}

module.exports = {
    intermineExpressionSourceAttributes,
    intermineExpressionSourceSort,
    graphqlExpressionSourceAttributes,
    response2expressionSources,
}
