import {
  IntermineDataResponse,
  response2graphqlObjects,
} from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

export const intermineCDSAttributes = [
  ...intermineSequenceFeatureAttributesFactory('CDS'),
  'CDS.transcript.primaryIdentifier',
  'CDS.isPrimary',
];
export const intermineCDSSort = 'CDS.primaryIdentifier';

export type IntermineCDS = [...IntermineSequenceFeature, string, boolean];

export const graphqlCDSAttributes = [
  ...graphqlSequenceFeatureAttributes,
  'transcriptIdentifier',
  'isPrimary',
];

export type GraphQLCDS = {
  [prop in (typeof graphqlCDSAttributes)[number]]: string;
};

export type IntermineCDSResponse = IntermineDataResponse<IntermineCDS>;

// converts an Intermine response into an array of GraphQL CDS objects
export function response2cdss(
  response: IntermineCDSResponse,
): Array<GraphQLCDS> {
  return response2graphqlObjects(response, graphqlCDSAttributes);
}
