import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import { IntermineSequenceFeature, graphqlSequenceFeatureAttributes } from './sequence-feature.js';

// <class name="IntergenicRegion" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0000605,http://purl.obolibrary.org/obo/SO:0000605">
//   <collection name="adjacentGenes" referenced-type="Gene"/>
// </class>
export const intermineIntergenicRegionAttributes = [
    'IntergenicRegion.id',
    'IntergenicRegion.primaryIdentifier',               // Annotatable
    'IntergenicRegion.description',                     // BioEntity
    'IntergenicRegion.symbol',                          // BioEntity
    'IntergenicRegion.name',                            // BioEntity
    'IntergenicRegion.assemblyVersion',                 // BioEntity
    'IntergenicRegion.annotationVersion',               // BioEntity
    'IntergenicRegion.secondaryIdentifier',             // BioEntity
    'IntergenicRegion.organism.taxonId',                // BioEntity - reference resolution
    'IntergenicRegion.strain.identifier',               // BioEntity - reference resolution
    'IntergenicRegion.score',                           // SequenceFeature
    'IntergenicRegion.scoreType',                       // SequenceFeature
    'IntergenicRegion.length',                          // SequenceFeature
    'IntergenicRegion.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'IntergenicRegion.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'IntergenicRegion.supercontigLocation.id',          // SequenceFeature - reference resolution
    'IntergenicRegion.sequence.id',                     // SequenceFeature - reference resolution
    'IntergenicRegion.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'IntergenicRegion.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
];
export const intermineIntergenicRegionSort = 'IntergenicRegion.primaryIdentifier';

export type IntermineIntergenicRegion = [
    ...IntermineSequenceFeature,
];

export const graphqlIntergenicRegionAttributes = [
    ...graphqlSequenceFeatureAttributes,
];

export type GraphQLIntergenicRegion = {
    [prop in typeof graphqlIntergenicRegionAttributes[number]]: string;
}

export type IntermineIntergenicRegionResponse = IntermineDataResponse<IntermineIntergenicRegion>;

// converts an Intermine response into an array of GraphQL IntergenicRegion objects
export function response2intergenicRegions(response: IntermineIntergenicRegionResponse): Array<GraphQLIntergenicRegion> {
    return response2graphqlObjects(response, graphqlIntergenicRegionAttributes);
}

// IntergenicRegion.adjacentGenes are Genes
export const intermineIntergenicRegionAdjacentGeneAttributes = [
    'IntergenicRegion.adjacentGenes.id',
    'IntergenicRegion.adjacentGenes.primaryIdentifier',               // Annotatable
    'IntergenicRegion.adjacentGenes.description',                     // BioEntity
    'IntergenicRegion.adjacentGenes.symbol',                          // BioEntity
    'IntergenicRegion.adjacentGenes.name',                            // BioEntity
    'IntergenicRegion.adjacentGenes.assemblyVersion',                 // BioEntity
    'IntergenicRegion.adjacentGenes.annotationVersion',               // BioEntity
    'IntergenicRegion.adjacentGenes.secondaryIdentifier',             // BioEntity
    'IntergenicRegion.adjacentGenes.organism.taxonId',                // BioEntity - reference resolution
    'IntergenicRegion.adjacentGenes.strain.identifier',               // BioEntity - reference resolution
    'IntergenicRegion.adjacentGenes.score',                           // SequenceFeature
    'IntergenicRegion.adjacentGenes.scoreType',                       // SequenceFeature
    'IntergenicRegion.adjacentGenes.length',                          // SequenceFeature
    'IntergenicRegion.adjacentGenes.sequenceOntologyTerm.identifier', // SequenceFeature - reference resolution
    'IntergenicRegion.adjacentGenes.chromosomeLocation.id',           // SequenceFeature - reference resolution
    'IntergenicRegion.adjacentGenes.supercontigLocation.id',          // SequenceFeature - reference resolution
    'IntergenicRegion.adjacentGenes.sequence.id',                     // SequenceFeature - reference resolution
    'IntergenicRegion.adjacentGenes.chromosome.primaryIdentifier',    // SequenceFeature - reference resolution
    'IntergenicRegion.adjacentGenes.supercontig.primaryIdentifier',   // SequenceFeature - reference resolution
    'IntergenicRegion.adjacentGenes.briefDescription',
    'IntergenicRegion.adjacentGenes.ensemblName',
    'IntergenicRegion.adjacentGenes.upstreamIntergenicRegion.primaryIdentifier',   // reference resolution
    'IntergenicRegion.adjacentGenes.downstreamIntergenicRegion.primaryIdentifier', // reference resolution
];
export const intermineIntergenicRegionAdjacentGeneSort = 'IntergenicRegion.adjacentGenes.primaryIdentifier';
// use IntermineGene
// use graphqlGeneAttributes
// use GraphQLGene
// use IntermineGeneResponse
// use response2genes

