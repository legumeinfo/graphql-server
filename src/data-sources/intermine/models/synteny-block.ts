import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';


// <class name="SyntenyBlock" is-interface="true" term="">
// 	<attribute name="medianKs" type="java.lang.Double"/>
// 	<collection name="publications" referenced-type="Publication"/>
// 	<collection name="syntenicRegions" referenced-type="SyntenicRegion" reverse-reference="syntenyBlock"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const intermineSyntenyBlockAttributes = [
    ...intermineAnnotatableAttributesFactory('SyntenyBlock'),
    'SyntenyBlock.medianKs',
];
export const intermineSyntenyBlockSort = 'SyntenyBlock.medianKs';
export type IntermineSyntenyBlock = [
  ...IntermineAnnotatable,
  number,
];


// type SyntenyBlock {
//   id: ID!
//   medianKs: Float
//   # publications: [Publication]
//   syntenicRegions: [SyntenicRegion]
//   # dataSets
// }
export const graphqlSyntenyBlockAttributes = [
    ...graphqlAnnotatableAttributes,
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
