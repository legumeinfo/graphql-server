// <class name="SyntenyBlock" is-interface="true" term="">
// 	<attribute name="medianKs" type="java.lang.Double"/>
// 	<collection name="publications" referenced-type="Publication"/>
// 	<collection name="syntenicRegions" referenced-type="SyntenicRegion" reverse-reference="syntenyBlock"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const intermineSyntenyBlockAttributes = [
    'SyntenyBlock.id',
    'SyntenyBlock.medianKs',
];
export const intermineSyntenyBlockSort = 'SyntenyBlock.medianKs';


// type SyntenyBlock {
//   id: ID!
//   medianKs: Float
//   # publications: [Publication]
//   syntenicRegions: [SyntenicRegion]
//   # dataSets
// }
export const graphqlSyntenyBlockAttributes = [
    'id',
    'medianKs',
];


// converts an Intermine response into an array of GraphQL SyntenyBlock objects
export function response2syntenyBlocks(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlSyntenyBlockAttributes);
}


// SyntenyBlock.dataSets has no reverse reference
export const intermineSyntenyBlockDataSetAttributes = [
    'SyntenyBlock.dataSets.id',
    'SyntenyBlock.dataSets.description',
    'SyntenyBlock.dataSets.licence',
    'SyntenyBlock.dataSets.url',
    'SyntenyBlock.dataSets.name',
    'SyntenyBlock.dataSets.version',
    'SyntenyBlock.dataSets.synopsis',
    'SyntenyBlock.dataSets.publication.id',  // internal resolution of publication
];
export const intermineSyntenyBlockDataSetSort = 'SyntenyBlock.dataSets.name'; // guaranteed not null
