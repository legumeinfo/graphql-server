import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

// <class name="Transcript" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0000673,http://purl.obolibrary.org/obo/SO:0000673">
// 	<reference name="gene" referenced-type="Gene" reverse-reference="transcripts"/>
// 	<reference name="protein" referenced-type="Protein" reverse-reference="transcript" term="http://purl.uniprot.org/core/Protein,http://semanticscience.org/resource/SIO_010043"/>
// 	<collection name="introns" referenced-type="Intron" reverse-reference="transcripts" term="http://purl.obolibrary.org/obo/SO_0000188"/>
// 	<collection name="exons" referenced-type="Exon" reverse-reference="transcripts"/>
// 	<collection name="CDSs" referenced-type="CDS" reverse-reference="transcript"/>
// 	<collection name="UTRs" referenced-type="UTR" reverse-reference="transcripts"/>
// 	<collection name="panGeneSets" referenced-type="PanGeneSet" reverse-reference="transcripts"/>
// </class>
export const intermineTranscriptAttributes = [
    ...intermineSequenceFeatureAttributesFactory('Transcript'),
    'Transcript.gene.primaryIdentifier',          // Transcript - reference resolution
    'Transcript.protein.primaryIdentifier',       // Transcript - reference resolution
];
export const intermineTranscriptSort = 'Transcript.primaryIdentifier';

export type IntermineTranscript = [
    ...IntermineSequenceFeature,
    string, // gene.primaryIdentifier
    string, // protein.primaryIdentifier
];

export const graphqlTranscriptAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'geneIdentifier',       // resolve Gene
    'proteinIdentifier'     // resolve Protein
];

export type GraphQLTranscript = {
    [prop in typeof graphqlTranscriptAttributes[number]]: string;
}

export type IntermineTranscriptResponse = IntermineDataResponse<IntermineTranscript>;

// converts an Intermine response into an array of GraphQL Transcript objects
export function response2transcripts(response: IntermineTranscriptResponse): Array<GraphQLTranscript> {
    return response2graphqlObjects(response, graphqlTranscriptAttributes);
}
