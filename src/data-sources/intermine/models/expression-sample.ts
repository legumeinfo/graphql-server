// <class name="ExpressionSample" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="tissue" type="java.lang.String"/>
// 	<attribute name="num" type="java.lang.Integer"/>
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="replicateGroup" type="java.lang.String"/>
// 	<attribute name="treatment" type="java.lang.String"/>
// 	<attribute name="bioSample" type="java.lang.String"/>
// 	<attribute name="sraExperiment" type="java.lang.String"/>
// 	<attribute name="species" type="java.lang.String"/>
// 	<attribute name="genotype" type="java.lang.String"/>
// 	<attribute name="name" type="java.lang.String"/>
// 	<attribute name="developmentStage" type="java.lang.String"/>
// 	<reference name="source" referenced-type="ExpressionSource" reverse-reference="samples"/>
// </class>
export const intermineExpressionSampleAttributes = [
    'ExpressionSample.id',
    'ExpressionSample.primaryIdentifier',
    'ExpressionSample.tissue',
    'ExpressionSample.num',
    'ExpressionSample.description',
    'ExpressionSample.replicateGroup',
    'ExpressionSample.treatment',
    'ExpressionSample.bioSample',
    'ExpressionSample.sraExperiment',
    'ExpressionSample.species',
    'ExpressionSample.genotype',
    'ExpressionSample.name',
    'ExpressionSample.developmentStage',
    'ExpressionSample.source.id',
];
export const intermineExpressionSampleSort = 'ExpressionSample.primaryIdentifier';


// type ExpressionSample {
//   id: ID!
//   identifier: String!
//   # ontologyAnnotations
//   # publications
//   tissue: String
//   num: Int
//   description: String
//   replicateGroup: String
//   treatment: String
//   bioSample: String
//   sraExperiment: String
//   species: String
//   genotype: String
//   name: String
//   developmentStage: String
//   source: ExpressionSource
// }
export const graphqlExpressionSampleAttributes = [
    'id',
    'identifier',
    'tissue',
    'num',
    'description',
    'replicateGroup',
    'treatment',
    'bioSample',
    'sraExperiment',
    'species',
    'genotype',
    'name',
    'developmentStage',
    'sourceId',
];


export function response2expressionSamples(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlExpressionSampleAttributes);
}
