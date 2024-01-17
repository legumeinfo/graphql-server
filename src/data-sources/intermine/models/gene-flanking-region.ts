import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import { IntermineSequenceFeature, graphqlSequenceFeatureAttributes } from './sequence-feature.js';

// <class name="GeneFlankingRegion" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0000316,http://purl.obolibrary.org/obo/SO:0000316">
// 	<attribute name="isPrimary" type="java.lang.Boolean"/>
// 	<reference name="transcript" referenced-type="Transcript" reverse-reference="GeneFlankingRegions"/>
// </class>
export const intermineGeneFlankingRegionAttributes = [
    'GeneFlankingRegion.id',
    'GeneFlankingRegion.primaryIdentifier',               // Annotatable
    'GeneFlankingRegion.description',                     // BioEntity
    'GeneFlankingRegion.symbol',                          // BioEntity
    'GeneFlankingRegion.name',                            // BioEntity
    'GeneFlankingRegion.assemblyVersion',                 // BioEntity
    'GeneFlankingRegion.annotationVersion',               // BioEntity
    'GeneFlankingRegion.secondaryIdentifier',             // BioEntity
    'GeneFlankingRegion.organism.taxonId',                // BioEntity - reference resolution
    'GeneFlankingRegion.strain.identifier',               // BioEntity - reference resolution
    'GeneFlankingRegion.score',                           // SequenceFeature
    'GeneFlankingRegion.scoreType',                       // SequenceFeature
    'GeneFlankingRegion.length',                          // SequenceFeature
    'GeneFlankingRegion.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'GeneFlankingRegion.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'GeneFlankingRegion.supercontigLocation.id',          // SequenceFeature - reference resolution
    'GeneFlankingRegion.sequence.id',                     // SequenceFeature - reference resolution
    'GeneFlankingRegion.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'GeneFlankingRegion.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
    'GeneFlankingRegion.gene.primaryIdentifier',          // reference resolution
];
export const intermineGeneFlankingRegionSort = 'GeneFlankingRegion.primaryIdentifier';

export type IntermineGeneFlankingRegion = [
    ...IntermineSequenceFeature,
    string, // gene.primaryIdentifier
];

export const graphqlGeneFlankingRegionAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'geneIdentifier', // gene.primaryIdentifier
];

export type GraphQLGeneFlankingRegion = {
    [prop in typeof graphqlGeneFlankingRegionAttributes[number]]: string;
}

export type IntermineGeneFlankingRegionResponse = IntermineDataResponse<IntermineGeneFlankingRegion>;

// converts an Intermine response into an array of GraphQL GeneFlankingRegion objects
export function response2geneFlankingRegions(response: IntermineGeneFlankingRegionResponse): Array<GraphQLGeneFlankingRegion> {
    return response2graphqlObjects(response, graphqlGeneFlankingRegionAttributes);
}
