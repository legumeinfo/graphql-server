import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

// <class name="CDS" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0000316,http://purl.obolibrary.org/obo/SO:0000316">
// 	<attribute name="isPrimary" type="java.lang.Boolean"/>
// 	<reference name="transcript" referenced-type="Transcript" reverse-reference="CDSs"/>
// </class>
export const intermineCDSAttributes = [
    ...intermineSequenceFeatureAttributesFactory('CDS'),
    'CDS.transcript.primaryIdentifier',    // reference resolution
];
export const intermineCDSSort = 'CDS.primaryIdentifier';

export type IntermineCDS = [
    ...IntermineSequenceFeature,
    string, // transcript.primaryIdentifier
];

export const graphqlCDSAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'transcriptIdentifier', // transcript.primaryIdentifier
];

export type GraphQLCDS = {
    [prop in typeof graphqlCDSAttributes[number]]: string;
}

export type IntermineCDSResponse = IntermineDataResponse<IntermineCDS>;

// converts an Intermine response into an array of GraphQL CDS objects
export function response2cdss(response: IntermineCDSResponse): Array<GraphQLCDS> {
    return response2graphqlObjects(response, graphqlCDSAttributes);
}
