import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import { IntermineSequenceFeature, graphqlSequenceFeatureAttributes } from './sequence-feature.js';

// <class name="Exon" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0000316,http://purl.obolibrary.org/obo/SO:0000316">
// 	<attribute name="isPrimary" type="java.lang.Boolean"/>
// 	<reference name="transcript" referenced-type="Transcript" reverse-reference="Exons"/>
// </class>
export const intermineExonAttributes = [
    'Exon.id',
    'Exon.primaryIdentifier',               // Annotatable
    'Exon.description',                     // BioEntity
    'Exon.symbol',                          // BioEntity
    'Exon.name',                            // BioEntity
    'Exon.assemblyVersion',                 // BioEntity
    'Exon.annotationVersion',               // BioEntity
    'Exon.secondaryIdentifier',             // BioEntity
    'Exon.organism.taxonId',                // BioEntity - reference resolution
    'Exon.strain.identifier',               // BioEntity - reference resolution
    'Exon.score',                           // SequenceFeature
    'Exon.scoreType',                       // SequenceFeature
    'Exon.length',                          // SequenceFeature
    'Exon.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'Exon.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'Exon.supercontigLocation.id',          // SequenceFeature - reference resolution
    'Exon.sequence.id',                     // SequenceFeature - reference resolution
    'Exon.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'Exon.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
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
