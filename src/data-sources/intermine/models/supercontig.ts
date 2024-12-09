import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
    IntermineSequenceFeature,
    graphqlSequenceFeatureAttributes,
    intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';


export const intermineSupercontigAttributes = [
    ...intermineSequenceFeatureAttributesFactory('Supercontig'),
];
export const intermineSupercontigSort = 'Supercontig.primaryIdentifier'; // guaranteed not null
export type IntermineSupercontig = [
    ...IntermineSequenceFeature,
];


export const graphqlSupercontigAttributes = [
    ...graphqlSequenceFeatureAttributes,
];
export type GraphQLSupercontig = {
    [prop in typeof graphqlSupercontigAttributes[number]]: string;
}


export type IntermineSupercontigResponse = IntermineDataResponse<IntermineSupercontig>;
// converts an Intermine response into an array of GraphQL Supercontig objects
export function response2supercontigs(response: IntermineSupercontigResponse): Array<GraphQLSupercontig> {
    return response2graphqlObjects(response, graphqlSupercontigAttributes);
}
