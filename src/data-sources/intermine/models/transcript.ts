import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import { IntermineSequenceFeature, graphqlSequenceFeatureAttributes } from './sequence-feature.js';

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
    'Transcript.id',
    'Transcript.primaryIdentifier',             // Annotatable
    'Transcript.description',                   // BioEntity
    'Transcript.symbol',                        // BioEntity
    'Transcript.name',                          // BioEntity
    'Transcript.assemblyVersion',               // BioEntity
    'Transcript.annotationVersion',             // BioEntity
    'Transcript.secondaryIdentifier',           // BioEntity
    'Transcript.organism.taxonId',              // BioEntity - reference resolution
    'Transcript.strain.identifier',             // BioEntity - reference resolution
    'Transcript.score',                         // SequenceFeature
    'Transcript.scoreType',                     // SequenceFeature
    'Transcript.length',                        // SequenceFeature
    'Transcript.soTerm.identifier',             // SequenceFeature - reference resolution
    'Transcript.chromosomeLocation.id',         // SequenceFeature - reference resolution
    'Transcript.supercontigLocation.id',        // SequenceFeature - reference resolution
    'Transcript.sequence.id',                   // SequenceFeature - reference resolution
    'Transcript.chromosome.primaryIdentifier',  // SequenceFeature - reference resolution
    'Transcript.supercontig.primaryIdentifier', // SequenceFeature - reference resolution
    'Transcript.gene.primaryIdentifier',        // Transcript - reference resolution
    'Transcript.protein.primaryIdentifier',     // Transcript - reference resolution
];
export const intermineTranscriptSort = 'Transcript.primaryIdentifier';

export type IntermineTranscript = [
    ...IntermineSequenceFeature,
    string, // gene reference
    string, // protein reference
];

export const graphqlTranscriptAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'geneIdentifier',       // Gene resolution
    'proteinIdentifier'     // Protein resolution
];

export type GraphQLTranscript = {
    [prop in typeof graphqlTranscriptAttributes[number]]: string;
}

export type IntermineTranscriptResponse = IntermineDataResponse<IntermineTranscript>;

// converts an Intermine response into an array of GraphQL Transcript objects
export function response2transcripts(response: IntermineTranscriptResponse): Array<GraphQLTranscript> {
    return response2graphqlObjects(response, graphqlTranscriptAttributes);
}
