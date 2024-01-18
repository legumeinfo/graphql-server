import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import { IntermineTranscript, graphqlTranscriptAttributes } from './transcript.js';

// <class name="MRNA" extends="Transcript" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000234">
// 	<attribute name="isPrimary" type="java.lang.Boolean"/>
// </class>
export const intermineMRNAAttributes = [
    'MRNA.id',
    'MRNA.primaryIdentifier',               // Annotatable
    'MRNA.description',                     // BioEntity
    'MRNA.symbol',                          // BioEntity
    'MRNA.name',                            // BioEntity
    'MRNA.assemblyVersion',                 // BioEntity
    'MRNA.annotationVersion',               // BioEntity
    'MRNA.secondaryIdentifier',             // BioEntity
    'MRNA.organism.taxonId',                // BioEntity - reference resolution
    'MRNA.strain.identifier',               // BioEntity - reference resolution
    'MRNA.score',                           // SequenceFeature
    'MRNA.scoreType',                       // SequenceFeature
    'MRNA.length',                          // SequenceFeature
    'MRNA.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'MRNA.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'MRNA.supercontigLocation.id',          // SequenceFeature - reference resolution
    'MRNA.sequence.id',                     // SequenceFeature - reference resolution
    'MRNA.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'MRNA.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
    'MRNA.gene.primaryIdentifier',          // Transcript - reference resolution
    'MRNA.protein.primaryIdentifier',       // Transcript - reference resolution
    'MRNA.isPrimary',                       // MRNA
];

export const intermineMRNASort = 'MRNA.primaryIdentifier';

export type IntermineMRNA = [
    ...IntermineTranscript,
    boolean, // isPrimary
];

export const graphqlMRNAAttributes = [
    ...graphqlTranscriptAttributes,
    'isPrimary',                // isPrimary
];

export type GraphQLMRNA = {
  [prop in typeof graphqlMRNAAttributes[number]]: string;
}

export type IntermineMRNAResponse = IntermineDataResponse<IntermineMRNA>;

// converts an Intermine response into an array of GraphQL MRNA objects
export function response2mRNAs(response: IntermineMRNAResponse): Array<GraphQLMRNA> {
    return response2graphqlObjects(response, graphqlMRNAAttributes);
}
