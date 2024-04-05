import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineTranscript,
  intermineTranscriptAttributesFactory,
  intermineTranscriptSortFactory,
} from './transcript.js';

export const intermineMRNAAttributes = [
    ...intermineTranscriptAttributesFactory('MRNA'),
    'MRNA.isPrimary',
];
export const intermineMRNASort = intermineTranscriptSortFactory('MRNA');
export type IntermineMRNA = [
  ...IntermineTranscript,
  boolean,
];

export const graphqlMRNAAttributes = [
    'id',
    'identifier',
    'description',
    'symbol',
    'name',
    'assemblyVersion',
    'annotationVersion',
    'length',
    'organismTaxonId',
    'strainIdentifier',
    'geneIdentifier',
    'proteinIdentifier',
    'isPrimary',
];
export type GraphQLMRNA = {
  [prop in typeof graphqlMRNAAttributes[number]]: string;
}

export type IntermineMRNAResponse = IntermineDataResponse<IntermineMRNA>;
// converts an Intermine response into an array of GraphQL MRNA objects
export function response2mRNAs(response: IntermineMRNAResponse): Array<GraphQLMRNA> {
    return response2graphqlObjects(response, graphqlMRNAAttributes);
}
