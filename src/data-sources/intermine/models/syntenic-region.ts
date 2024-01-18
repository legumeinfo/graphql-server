import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import { IntermineSequenceFeature, graphqlSequenceFeatureAttributes } from './sequence-feature.js';

// <class name="SyntenicRegion" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0005858">
// 	<reference name="syntenyBlock" referenced-type="SyntenyBlock" reverse-reference="syntenicRegions"/>
// </class>
export const intermineSyntenicRegionAttributes = [
    'SyntenicRegion.id',
    'SyntenicRegion.primaryIdentifier',               // Annotatable
    'SyntenicRegion.description',                     // BioEntity
    'SyntenicRegion.symbol',                          // BioEntity
    'SyntenicRegion.name',                            // BioEntity
    'SyntenicRegion.assemblyVersion',                 // BioEntity
    'SyntenicRegion.annotationVersion',               // BioEntity
    'SyntenicRegion.secondaryIdentifier',             // BioEntity
    'SyntenicRegion.organism.taxonId',                // BioEntity - reference resolution
    'SyntenicRegion.strain.identifier',               // BioEntity - reference resolution
    'SyntenicRegion.score',                           // SequenceFeature
    'SyntenicRegion.scoreType',                       // SequenceFeature
    'SyntenicRegion.length',                          // SequenceFeature
    'SyntenicRegion.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'SyntenicRegion.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'SyntenicRegion.supercontigLocation.id',          // SequenceFeature - reference resolution
    'SyntenicRegion.sequence.id',                     // SequenceFeature - reference resolution
    'SyntenicRegion.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'SyntenicRegion.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
    'SyntenicRegion.syntenyBlock.id',                 // resolve reference
];
export const intermineSyntenicRegionSort = 'SyntenicRegion.primaryIdentifier';

export type IntermineSyntenicRegion = [
    ...IntermineSequenceFeature,
    number, // syntenyBlock.id
];

export const graphqlSyntenicRegionAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'syntenyBlockId', // syntenyBlock.id
];

export type GraphQLSyntenicRegion = {
  [prop in typeof graphqlSyntenicRegionAttributes[number]]: string;
}

export type IntermineSyntenicRegionResponse = IntermineDataResponse<IntermineSyntenicRegion>;

// converts an Intermine response into an array of GraphQL SyntenicRegion objects
export function response2syntenicRegions(response: IntermineSyntenicRegionResponse): Array<GraphQLSyntenicRegion> {
    return response2graphqlObjects(response, graphqlSyntenicRegionAttributes);
}
