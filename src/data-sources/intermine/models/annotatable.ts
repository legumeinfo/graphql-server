import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

export const intermineAnnotatableAttributes = [
    'Annotatable.id',
    'Annotatable.primaryIdentifier',
];
export const intermineAnnotatableSort = 'Annotatable.primaryIdentifier';

// this may be used for any type that extends Annotatable without additional attributes or references
export type IntermineAnnotatable = [
    number, // id
    string, // primaryIdentifier
];

// this may be used for any type that extends Annotatable without additional attributes or references
export const graphqlAnnotatableAttributes = [
    'id',         // id
    'identifier', // primaryIdentifier
];

// this may be used for any type that extends Annotatable without additional attributes or references
export type GraphQLAnnotatable = {
    [prop in typeof graphqlAnnotatableAttributes[number]]: string;
}
    
// this may be used for any type that extends Annotatable without additional attributes or references
export type IntermineAnnotatableResponse = IntermineDataResponse<IntermineAnnotatable>;

// converts an Intermine response into an array of GraphQL Annotatable objects
// this may be used for any type that extends Annotatable without additional attributes or references
export function response2annotatables(response: IntermineAnnotatableResponse): Array<GraphQLAnnotatable> {
    return response2graphqlObjects(response, graphqlAnnotatableAttributes);
}
