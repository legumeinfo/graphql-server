import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="GWASResult" is-interface="true" term="">
// 	<attribute name="pValue" type="java.lang.Double"/>
//      <attribute name="markerName" type="java.lang.String"/>
// 	<reference name="gwas" referenced-type="GWAS" reverse-reference="results"/>
// 	<reference name="trait" referenced-type="Trait" reverse-reference="gwasResults"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="markers" referenced-type="GeneticMarker" reverse-reference="gwasResults"/>
// </class>
export const intermineGWASResultAttributes = [
    'GWASResult.id',
    'GWASResult.primaryIdentifier',
    'GWASResult.pValue',
    'GWASResult.markerName',
    'GWASResult.gwas.primaryIdentifier',
    'GWASResult.trait.primaryIdentifier',
    'GWASResult.dataSet.name',
];
export const intermineGWASResultSort = 'GWASResult.markerName';
export type IntermineGWASResult = [
    number,
    string,
    number,
    string,
    string,
    string,
    string,
];


// type GWASResult {
//   id: ID!
//   identifier: ID!
//   pValue: Float
//   markerName: String
//   # gwas: GWAS
//   trait: Trait
//   dataSet
//   # markers
// }
export const graphqlGWASResultAttributes = [
    'id',
    'identifier',
    'pValue',
    'markerName',
    'gwasIdentifier',
    'traitIdentifier',
    'dataSetName',
];
export type GraphQLGWASResult = {
  [prop in typeof graphqlGWASResultAttributes[number]]: string;
}


export type IntermineGWASResultResponse = Response<IntermineGWASResult>;
export function response2gwasResults(response: IntermineGWASResultResponse): Array<GraphQLGWASResult> {
    return response2graphqlObjects(response, graphqlGWASResultAttributes);
}
