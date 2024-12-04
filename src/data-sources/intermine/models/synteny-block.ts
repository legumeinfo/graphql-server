import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    IntermineAnnotatable,
    graphqlAnnotatableAttributes,
    intermineAnnotatableAttributesFactory,
} from './annotatable.js';


export const intermineSyntenyBlockAttributes = [
    ...intermineAnnotatableAttributesFactory('SyntenyBlock'),
    'SyntenyBlock.medianKs',
];
export const intermineSyntenyBlockSort = 'SyntenyBlock.medianKs';
export type IntermineSyntenyBlock = [
  ...IntermineAnnotatable,
  number,
];


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
