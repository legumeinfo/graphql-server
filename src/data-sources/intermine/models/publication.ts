import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';


export const interminePublicationAttributes = [
    'Publication.id',
    'Publication.year',
    'Publication.issue',
    'Publication.title',
    'Publication.pages',
    'Publication.doi',
    'Publication.volume',
    'Publication.journal',
    'Publication.firstAuthor',
    'Publication.month',
    'Publication.abstractText',
    'Publication.pubMedId',
];
export const interminePublicationSort = 'Publication.doi'; // guaranteed not null
export type InterminePublication = [
    number,
    number,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
];


export const graphqlPublicationAttributes = [
    'id',
    'year',
    'issue',
    'title',
    'pages',
    'doi',
    'volume',
    'journal',
    'firstAuthor',
    'month',
    'abstractText',
    'pubMedId',
];
export type GraphQLPublication = {
    [prop in typeof graphqlPublicationAttributes[number]]: string;
}


export type InterminePublicationResponse = IntermineDataResponse<InterminePublication>;
// converts an Intermine response into an array of GraphQL Publication objects
export function response2publications(response: InterminePublicationResponse): Array<GraphQLPublication> {
    return response2graphqlObjects(response, graphqlPublicationAttributes);
}
