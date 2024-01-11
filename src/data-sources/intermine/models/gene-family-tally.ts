import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="GeneFamilyTally" is-interface="true" term="">
// 	<attribute name="averageCount" type="java.lang.Double"/>
// 	<attribute name="totalCount" type="java.lang.Integer"/>
// 	<attribute name="numAnnotations" type="java.lang.Integer"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<reference name="geneFamily" referenced-type="GeneFamily" reverse-reference="tallies"/>
// </class>
export const intermineGeneFamilyTallyAttributes = [
    'GeneFamilyTally.id',
    'GeneFamilyTally.averageCount',
    'GeneFamilyTally.totalCount',
    'GeneFamilyTally.numAnnotations',
    'GeneFamilyTally.organism.taxonId',             // resolve reference
    'GeneFamilyTally.geneFamily.primaryIdentifier', // resolve reference
];
export const intermineGeneFamilyTallySort = 'GeneFamilyTally.id';

export type IntermineGeneFamilyTally = [
    number, // id
    number, // averageCount
    number, // totalCount
    number, // numAnnotations
    number, // organism.taxonId
    string, // geneFamily.primaryIdentifier
];

export const graphqlGeneFamilyTallyAttributes = [
    'id',                    // id
    'averageCount',          // averageCount
    'totalCount',            // totalCount
    'numAnnotations',        // numAnnotations
    'organismTaxonId',       // resolve Organism
    'geneFamilyIdentifier',  // resolve GeneFamily
];

export type GraphQLGeneFamilyTally = {
    [prop in typeof graphqlGeneFamilyTallyAttributes[number]]: string;
}

export type IntermineGeneFamilyTallyResponse = IntermineDataResponse<IntermineGeneFamilyTally>;

export function response2geneFamilyTallies(response: IntermineGeneFamilyTallyResponse): Array<GraphQLGeneFamilyTally> {
    return response2graphqlObjects(response, graphqlGeneFamilyTallyAttributes);
}
