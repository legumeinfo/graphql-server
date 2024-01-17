import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import { IntermineSequenceFeature, graphqlSequenceFeatureAttributes } from './sequence-feature.js';

// <class name="Intron" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000188,http://purl.obolibrary.org/obo/SO_0000188">
// 	<collection name="transcripts" referenced-type="Transcript" reverse-reference="introns" term="http://purl.obolibrary.org/obo/SO_0000673"/>
// 	<collection name="genes" referenced-type="Gene" reverse-reference="introns" term="http://purl.obolibrary.org/obo/SO:0000704"/>
// </class>
export const intermineIntronAttributes = [
    'Intron.id',
    'Intron.primaryIdentifier',               // Annotatable
    'Intron.description',                     // BioEntity
    'Intron.symbol',                          // BioEntity
    'Intron.name',                            // BioEntity
    'Intron.assemblyVersion',                 // BioEntity
    'Intron.annotationVersion',               // BioEntity
    'Intron.secondaryIdentifier',             // BioEntity
    'Intron.organism.taxonId',                // BioEntity - reference resolution
    'Intron.strain.identifier',               // BioEntity - reference resolution
    'Intron.score',                           // SequenceFeature
    'Intron.scoreType',                       // SequenceFeature
    'Intron.length',                          // SequenceFeature
    'Intron.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'Intron.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'Intron.supercontigLocation.id',          // SequenceFeature - reference resolution
    'Intron.sequence.id',                     // SequenceFeature - reference resolution
    'Intron.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'Intron.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
];
export const intermineIntronSort = 'Intron.primaryIdentifier';

export type IntermineIntron = [
    ...IntermineSequenceFeature,
];

export const graphqlIntronAttributes = [
    ...graphqlSequenceFeatureAttributes,
];

export type GraphQLIntron = {
    [prop in typeof graphqlIntronAttributes[number]]: string;
}

export type IntermineIntronResponse = IntermineDataResponse<IntermineIntron>;

// converts an Intermine response into an array of GraphQL Intron objects
export function response2introns(response: IntermineIntronResponse): Array<GraphQLIntron> {
    return response2graphqlObjects(response, graphqlIntronAttributes);
}
