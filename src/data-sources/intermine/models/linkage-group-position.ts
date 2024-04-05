import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

export const intermineLinkageGroupPositionAttributesFactory = (type = 'LinkageGroupPosition') => [
    `${type}.id`,
    `${type}.position`,
    `${type}.markerName`,
    `${type}.linkageGroup.primaryIdentifier`,
];
export const intermineLinkageGroupPositionAttributes = intermineLinkageGroupPositionAttributesFactory();

export const intermineLinkageGroupPositionSortFactory = (type = 'LinkageGroupPosition') => `${type}.position`;
export const intermineLinkageGroupPositionSort = intermineLinkageGroupPositionSortFactory();

export type IntermineLinkageGroupPosition = [
  number,
  number,
  string,
  string,
];

export const graphqlLinkageGroupPositionAttributes = [
    'id',
    'position',
    'markerName',
    'linkageGroupIdentifier',
];
export type GraphQLLinkageGroupPosition = {
  [prop in typeof graphqlLinkageGroupPositionAttributes[number]]: string;
}


export type IntermineLinkageGroupPositionResponse = IntermineDataResponse<IntermineLinkageGroupPosition>;
export function response2linkageGroupPositions(response: IntermineLinkageGroupPositionResponse): Array<GraphQLLinkageGroupPosition> {
    return response2graphqlObjects(response, graphqlLinkageGroupPositionAttributes);
}
