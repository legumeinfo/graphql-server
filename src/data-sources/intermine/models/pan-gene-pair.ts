import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

export const interminePanGenePairAttributes = [
    'Gene.primaryIdentifier',
    'Gene.panGeneSets.primaryIdentifier',
    'Gene.panGeneSets.genes.primaryIdentifier',
];
export const interminePanGenePairSort = 'Gene.panGeneSets.genes.primaryIdentifier';
export const interminePanGenePairSummaryPath = 'Gene.panGeneSets.genes.primaryIdentifier';
export type InterminePanGenePair = [
    string,
    string,
    string,
];

export const graphqlPanGenePairAttributes = [
    'resultGeneIdentifier',
    'panGeneSetIdentifier',
    'queryGeneIdentifier',
];
export type GraphQLPanGenePair = {
    [prop in typeof graphqlPanGenePairAttributes[number]]: string;
}


export type InterminePanGenePairResponse = IntermineDataResponse<InterminePanGenePair>;
// converts an Intermine response into an array of GraphQL PanGenePair objects
export function response2panGenePairs(response: InterminePanGenePairResponse): Array<GraphQLPanGenePair> {
    return response2graphqlObjects(response, graphqlPanGenePairAttributes);
}
