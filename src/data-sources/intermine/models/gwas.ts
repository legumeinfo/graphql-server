import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="GWAS" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="genotypes" type="java.lang.String"/>
// 	<attribute name="genotypingMethod" type="java.lang.String"/>
// 	<attribute name="synopsis" type="java.lang.String"/>
// 	<reference name="genotypingPlatform" referenced-type="GenotypingPlatform"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<collection name="results" referenced-type="GWASResult" reverse-reference="gwas"/>
// </class>
export const intermineGWASAttributes = [
    'GWAS.id',                 // Annotatable
    'GWAS.primaryIdentifier',  // Annotatable
    'GWAS.description',
    'GWAS.genotypes',
    'GWAS.genotypingMethod',
    'GWAS.synopsis',
    'GWAS.genotypingPlatform.primaryIdentifier', // resolve reference
    'GWAS.organism.taxonId',                     // resolve reference
];
export const intermineGWASSort = 'GWAS.primaryIdentifier';

export type IntermineGWAS = [
  number, // id
  string, // primaryIdentifier
  string, // description
  string, // genotypes
  string, // genotypingMethod
  string, // synopsis
  string, // genotypingPlatform.primaryIdentifier
  number, // organism.taxonId
];

export const graphqlGWASAttributes = [
    'id',                           // id
    'identifier',                   // primaryIdentifier
    'description',                  // description
    'genotypes',                    // genotypes
    'genotypingMethod',             // genotypingMethod
    'synopsis',                     // synopsis
    'genotypingPlatformIdentifier', // resolve GenotypingPlatform
    'organismTaxonId',              // resolve Organism
];

export type GraphQLGWAS = {
  [prop in typeof graphqlGWASAttributes[number]]: string;
}

export type IntermineGWASResponse = IntermineDataResponse<IntermineGWAS>;

export function response2gwas(response: IntermineGWASResponse): Array<GraphQLGWAS> {
    return response2graphqlObjects(response, graphqlGWASAttributes);
}
