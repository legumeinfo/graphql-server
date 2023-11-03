import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';


// <class name="LinkageGroupPosition" is-interface="true" term="">
// 	<attribute name="position" type="java.lang.Double"/>
// 	<attribute name="markerName" type="java.lang.String"/>
// 	<reference name="linkageGroup" referenced-type="LinkageGroup"/>
// </class>
export const intermineLinkageGroupPositionAttributes = [
    'LinkageGroupPosition.id',
    'LinkageGroupPosition.position',
    'LinkageGroupPosition.markerName',
    'LinkageGroupPosition.linkageGroup.primaryIdentifier',
];
export const intermineLinkageGroupPositionSort = 'LinkageGroupPosition.position';
export type IntermineLinkageGroupPosition = [
  number,
  number,
  string,
  string,
];


// type LinkageGroupPosition {
//   id: ID!
//   position: Float
//   markerName: String
//   linkageGroup: LinkageGroup
// }
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


// Handle lack of reverse reference to GeneticMarker in LinkageGroupPosition
export const intermineGeneticMarkerLinkageGroupPositionsAttributes = [
    'GeneticMarker.linkageGroupPositions.id',
    'GeneticMarker.linkageGroupPositions.position',
    'GeneticMarker.linkageGroupPositions.markerName',
    'GeneticMarker.linkageGroupPositions.linkageGroup.id',
];
export const intermineGeneticMarkerLinkageGroupPositionsSort = 'GeneticMarker.linkageGroupPositions.position';
export type IntermineGeneticMarkerLinkageGroupPositions = [
  number,
  number,
  string,
  number,
];
