import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="GenotypingPlatform" extends="Annotatable" is-interface="true" term="">
// 	<collection name="markers" referenced-type="GeneticMarker" reverse-reference="genotypingPlatforms"/>
// </class>
export const intermineGenotypingPlatformAttributes = [
    'GenotypingPlatform.id',                 // Annotatable
    'GenotypingPlatform.primaryIdentifier',  // Annotatable
];
export const intermineGenotypingPlatformSort = 'GenotypingPlatform.primaryIdentifier';

export type IntermineGenotypingPlatform = [
    number, // id
    string, // primaryIdentifier
];

export const graphqlGenotypingPlatformAttributes = [
    'id',         // id
    'identifier', // primaryIdentifier
];

export type GraphQLGenotypingPlatform = {
    [prop in typeof graphqlGenotypingPlatformAttributes[number]]: string;
}

export type IntermineGenotypingPlatformResponse = IntermineDataResponse<IntermineGenotypingPlatform>;
export function response2genotypingPlatforms(response: IntermineGenotypingPlatformResponse): Array<GraphQLGenotypingPlatform> {
    return response2graphqlObjects(response, graphqlGenotypingPlatformAttributes);
}
