import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="GeneFamily" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="version" type="java.lang.String"/>
// 	<attribute name="size" type="java.lang.Integer"/>
// 	<reference name="phylotree" referenced-type="Phylotree" reverse-reference="geneFamily"/>
// 	<collection name="genes" referenced-type="Gene"/>
// 	<collection name="proteins" referenced-type="Protein"/>
// 	<collection name="proteinDomains" referenced-type="ProteinDomain" reverse-reference="geneFamilies"/>
// 	<collection name="tallies" referenced-type="GeneFamilyTally" reverse-reference="geneFamily"/>
// </class>
export const intermineGeneFamilyAttributes = [
    'GeneFamily.id',
    'GeneFamily.primaryIdentifier', // Annotatable
    'GeneFamily.description',
    'GeneFamily.version',
    'GeneFamily.size',
    'GeneFamily.phylotree.primaryIdentifier',      // resolve reference
];
export const intermineGeneFamilySort = 'GeneFamily.primaryIdentifier';
export type IntermineGeneFamily = [
    number, // id
    string, // primaryIdentifier
    string, // description
    string, // version
    number, // size
    string, // phylotree.primaryIdentifier
];

export const graphqlGeneFamilyAttributes = [
    'id',                  // id
    'identifier',          // primaryIdentifier
    'description',         // description
    'version',             // version
    'size',                // size
    'phylotreeIdentifier', // Phylotree resolution
];
export type GraphQLGeneFamily = {
    [prop in typeof graphqlGeneFamilyAttributes[number]]: string;
}

export type IntermineGeneFamilyResponse = IntermineDataResponse<IntermineGeneFamily>;

export function response2geneFamilies(response: IntermineGeneFamilyResponse): Array<GraphQLGeneFamily> {
    return response2graphqlObjects(response, graphqlGeneFamilyAttributes);
}
