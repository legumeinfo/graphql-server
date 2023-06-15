import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';


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
export const intermineExpressionSourceAttributes = [
    'ExpressionSource.id',
    'ExpressionSource.primaryIdentifier',
    'ExpressionSource.sra',
    'ExpressionSource.description',
    'ExpressionSource.bioProject',
    'ExpressionSource.unit',
    'ExpressionSource.geoSeries',
    'ExpressionSource.synopsis',
    'ExpressionSource.organism.taxonId',
    'ExpressionSource.strain.identifier',
    'ExpressionSource.dataSet.name',
];
export const intermineExpressionSourceSort = 'ExpressionSource.primaryIdentifier';
export type IntermineExpressionSource = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  string,
];


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
export const graphqlExpressionSourceAttributes = [
    'id',
    'identifier',
    'sra',
    'description',
    'bioProject',
    'unit',
    'geoSeries',
    'synopsis',
    'organismTaxonId',
    'strainIdentifier',
    'dataSetName',
];
export type GraphQLExpressionSource = {
  [prop in typeof graphqlExpressionSourceAttributes[number]]: string;
}


export type IntermineExpressionSourceResponse = IntermineDataResponse<IntermineExpressionSource>;
export function response2expressionSources(response: IntermineExpressionSourceResponse): Array<GraphQLExpressionSource> {
    return response2graphqlObjects(response, graphqlExpressionSourceAttributes);
}
