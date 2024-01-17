import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import { IntermineSequenceFeature, graphqlSequenceFeatureAttributes } from './sequence-feature.js';

// <class name="UTR" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0000316,http://purl.obolibrary.org/obo/SO:0000316">
// 	<collection name="transcripts" referenced-type="Transcript" reverse-reference="UTRs"/>
// </class>
export const intermineUTRAttributes = [
    'UTR.id',
    'UTR.primaryIdentifier',               // Annotatable
    'UTR.description',                     // BioEntity
    'UTR.symbol',                          // BioEntity
    'UTR.name',                            // BioEntity
    'UTR.assemblyVersion',                 // BioEntity
    'UTR.annotationVersion',               // BioEntity
    'UTR.secondaryIdentifier',             // BioEntity
    'UTR.organism.taxonId',                // BioEntity - reference resolution
    'UTR.strain.identifier',               // BioEntity - reference resolution
    'UTR.score',                           // SequenceFeature
    'UTR.scoreType',                       // SequenceFeature
    'UTR.length',                          // SequenceFeature
    'UTR.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'UTR.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'UTR.supercontigLocation.id',          // SequenceFeature - reference resolution
    'UTR.sequence.id',                     // SequenceFeature - reference resolution
    'UTR.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'UTR.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
];
export const intermineUTRSort = 'UTR.primaryIdentifier';

export type IntermineUTR = [
    ...IntermineSequenceFeature,
];

export const graphqlUTRAttributes = [
    ...graphqlSequenceFeatureAttributes,
];

export type GraphQLUTR = {
    [prop in typeof graphqlUTRAttributes[number]]: string;
}

export type IntermineUTRResponse = IntermineDataResponse<IntermineUTR>;

// converts an Intermine response into an array of GraphQL UTR objects
export function response2utrs(response: IntermineUTRResponse): Array<GraphQLUTR> {
    return response2graphqlObjects(response, graphqlUTRAttributes);
}
