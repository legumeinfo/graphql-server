import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="QTLStudy" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="genotypes" type="java.lang.String"/>
// 	<attribute name="synopsis" type="java.lang.String"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="qtlStudy"/>
// </class>
export const intermineQTLStudyAttributes = [
    'QTLStudy.id',                  // Annotatable
    'QTLStudy.primaryIdentifier',   // Annotatable
    'QTLStudy.description',
    'QTLStudy.genotypes',
    'QTLStudy.synopsis',
    'QTLStudy.organism.taxonId',    // resolve reference
];
export const intermineQTLStudySort = 'QTLStudy.primaryIdentifier';

export type IntermineQTLStudy = [
  number, // id
  string, // primaryIdentifier
  string, // description
  string, // genotypes
  string, // synopsis
  number, // organism.taxonId
];

export const graphqlQTLStudyAttributes = [
    'id',              // id
    'identifier',      // primaryIdentifier
    'description',     // description
    'genotypes',       // genotypes
    'synopsis',        // synopsis
    'organismTaxonId', // resolve Organism
];

export type GraphQLQTLStudy = {
  [prop in typeof graphqlQTLStudyAttributes[number]]: string;
}

export type IntermineQTLStudyResponse = IntermineDataResponse<IntermineQTLStudy>;

export function response2qtlStudies(response: IntermineQTLStudyResponse): Array<GraphQLQTLStudy> {
    return response2graphqlObjects(response, graphqlQTLStudyAttributes);
}
