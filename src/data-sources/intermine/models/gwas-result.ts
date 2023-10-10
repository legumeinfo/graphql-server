import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="GWASResult" is-interface="true">
//   <attribute name="markerName" type="java.lang.String"/>
//   <attribute name="pValue" type="java.lang.Double"/>
//   <reference name="gwas" referenced-type="GWAS" reverse-reference="results"/>
//   <reference name="trait" referenced-type="Trait" reverse-reference="gwasResults"/>
//   <collection name="markers" referenced-type="GeneticMarker" reverse-reference="gwasResults"/>
//   <reference name="dataSet" referenced-type="DataSet"/>
// </class>
export const intermineGWASResultAttributes = [
    'GWASResult.id',
    'GWASResult.markerName',
    'GWASResult.pValue',
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
];

// type GWASResult {
//   id: ID!
//   markerName: String!
//   pValue: Float!
//   gwas: GWAS!
//   trait: Trait!
//   markers: [GeneticMarker]
//   dataSet: DataSet!
// }
export const graphqlGWASResultAttributes = [
    'id',
    'markerName',
    'pValue',
    'gwasIdentifier',
    'traitIdentifier',
    'dataSetName',
];
export type GraphQLGWASResult = {
    [prop in typeof graphqlGWASResultAttributes[number]]: string;
}

export type IntermineGWASResultResponse = IntermineDataResponse<IntermineGWASResult>;
export function response2gwasResults(response: IntermineGWASResultResponse): Array<GraphQLGWASResult> {
    return response2graphqlObjects(response, graphqlGWASResultAttributes);
}
