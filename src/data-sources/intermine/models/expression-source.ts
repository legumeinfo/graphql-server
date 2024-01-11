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
];

export const graphqlExpressionSourceAttributes = [
    'id',               // id
    'identifier',       // primaryIdentifier
    'sra',              // sra
    'description',      // description
    'bioProject',       // bioProject
    'unit',             // unit
    'geoSeries',        // geoSeries
    'synopsis',         // synopsis
    'organismTaxonId',  // organism.taxonId
    'strainIdentifier', // strain.identifier
];
export type GraphQLExpressionSource = {
  [prop in typeof graphqlExpressionSourceAttributes[number]]: string;
}

export type IntermineExpressionSourceResponse = IntermineDataResponse<IntermineExpressionSource>;

export function response2expressionSources(response: IntermineExpressionSourceResponse): Array<GraphQLExpressionSource> {
    return response2graphqlObjects(response, graphqlExpressionSourceAttributes);
}
