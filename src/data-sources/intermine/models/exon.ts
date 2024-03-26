import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

// <class name="Exon" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0000316,http://purl.obolibrary.org/obo/SO:0000316">
// 	<attribute name="isPrimary" type="java.lang.Boolean"/>
// 	<reference name="transcript" referenced-type="Transcript" reverse-reference="Exons"/>
// </class>
export const intermineExonAttributes = [
    ...intermineSequenceFeatureAttributesFactory('Exon'),
];
export const intermineExonSort = 'Exon.primaryIdentifier';

export type IntermineExon = [
    ...IntermineSequenceFeature,
];

export const graphqlExonAttributes = [
    ...graphqlSequenceFeatureAttributes,
];

export type GraphQLExon = {
    [prop in typeof graphqlExonAttributes[number]]: string;
}

export type IntermineExonResponse = IntermineDataResponse<IntermineExon>;

// converts an Intermine response into an array of GraphQL Exon objects
export function response2exons(response: IntermineExonResponse): Array<GraphQLExon> {
    return response2graphqlObjects(response, graphqlExonAttributes);
}
