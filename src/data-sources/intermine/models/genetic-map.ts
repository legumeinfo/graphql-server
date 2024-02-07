import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="GeneticMap" extends="Annotatable" is-interface="true" term="http://purl.bioontology.org/ontology/EDAM?conceptid=http%3A%2F%2Fedamontology.org%2Fdata_1278">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="genotypes" type="java.lang.String"/>
// 	<attribute name="genotypingMethod" type="java.lang.String"/>
// 	<attribute name="synopsis" type="java.lang.String"/>
// 	<reference name="genotypingPlatform" referenced-type="GenotypingPlatform"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<collection name="linkageGroups" referenced-type="LinkageGroup" reverse-reference="geneticMap"/>
// </class>
export const intermineGeneticMapAttributes = [
    'GeneticMap.id',
    'GeneticMap.primaryIdentifier', // Annotatable
    'GeneticMap.description',
    'GeneticMap.genotypes',
    'GeneticMap.genotypingMethod',
    'GeneticMap.synopsis',
    'GeneticMap.genotypingPlatform.primaryIdentifier', // resolve reference
    'GeneticMap.organism.taxonId',                     // resolve reference
];
export const intermineGeneticMapSort = 'GeneticMap.primaryIdentifier';

export type IntermineGeneticMap = [
    number, // id
    string, // primaryIdentifier
    string, // description
    string, // genotypes
    string, // genotypingMethod
    string, // synopsis
    string, // genotypingPlatform.primaryIdentifier
    number, // organism.taxonId
];

export const graphqlGeneticMapAttributes = [
    'id',
    'identifier',
    'description',
    'genotypes',
    'genotypingMethod',
    'synopsis',
    'genotypingPlatformIdentifier',
    'organismTaxonId',
];

export type GraphQLGeneticMap = {
    [prop in typeof graphqlGeneticMapAttributes[number]]: string;
}

export type IntermineGeneticMapResponse = IntermineDataResponse<IntermineGeneticMap>;

export function response2geneticMaps(response: IntermineGeneticMapResponse): Array<GraphQLGeneticMap> {
    return response2graphqlObjects(response, graphqlGeneticMapAttributes);
}

