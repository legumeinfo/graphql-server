import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="GWASResult" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="pValue" type="java.lang.Double"/>
// 	<attribute name="markerName" type="java.lang.String"/>
// 	<reference name="gwas" referenced-type="GWAS" reverse-reference="results"/>
// 	<reference name="trait" referenced-type="Trait" reverse-reference="gwasResults"/>
// 	<collection name="markers" referenced-type="GeneticMarker" reverse-reference="gwasResults"/>
// </class>
export const intermineGWASResultAttributes = [
    'GWASResult.id',                         // Annotatable
    'GWASResult.primaryIdentifier',          // Annotatable
    'GWASResult.pValue',
    'GWASResult.markerName',
    'GWASResult.gwas.primaryIdentifier',     // resolve reference
    'GWASResult.trait.primaryIdentifier',    // resolve reference
];
export const intermineGWASResultSort = 'GWASResult.markerName';

export type IntermineGWASResult = [
    number, // id
    string, // primaryIdentifier
    number, // pValue
    string, // markerName
    string, // gwas.primaryIdentifier
    string, // trait.primaryIdentifier
];

export const graphqlGWASResultAttributes = [
    'id',              // id
    'identifier',      // primaryIdentifier
    'pValue',          // pValue
    'markerName',      // makerName
    'gwasIdentifier',  // resolve GWAS
    'traitIdentifier', // resolve Trait
];

export type GraphQLGWASResult = {
    [prop in typeof graphqlGWASResultAttributes[number]]: string;
}

export type IntermineGWASResultResponse = IntermineDataResponse<IntermineGWASResult>;

export function response2gwasResults(response: IntermineGWASResultResponse): Array<GraphQLGWASResult> {
    return response2graphqlObjects(response, graphqlGWASResultAttributes);
}
