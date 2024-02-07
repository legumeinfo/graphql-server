import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="SyntenyBlock" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="medianKs" type="java.lang.Double"/>
// 	<collection name="syntenicRegions" referenced-type="SyntenicRegion" reverse-reference="syntenyBlock" term="http://purl.obolibrary.org/obo/SO_0005858"/>
// </class>
export const intermineSyntenyBlockAttributes = [
    'SyntenyBlock.id',
    'SyntenyBlock.primaryIdentifier', // Annotatable
    'SyntenyBlock.medianKs',
];
export const intermineSyntenyBlockSort = 'SyntenyBlock.medianKs';

export type IntermineSyntenyBlock = [
    number, // id
    string, // primaryIdentifier
    number, // medianKs
];

export const graphqlSyntenyBlockAttributes = [
    'id',
    'identifier',
    'medianKs',
];

export type GraphQLSyntenyBlock = {
  [prop in typeof graphqlSyntenyBlockAttributes[number]]: string;
}


export type IntermineSyntenyBlockResponse = IntermineDataResponse<IntermineSyntenyBlock>;
// converts an Intermine response into an array of GraphQL SyntenyBlock objects

export function response2syntenyBlocks(response: IntermineSyntenyBlockResponse): Array<GraphQLSyntenyBlock> {
    return response2graphqlObjects(response, graphqlSyntenyBlockAttributes);
}
