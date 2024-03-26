import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

// <class name="Gene" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000704">
//  <attribute name="briefDescription" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000136"/>
//  <attribute name="ensemblName" type="java.lang.String"/>
//  <reference name="upstreamIntergenicRegion" referenced-type="IntergenicRegion" term="http://purl.obolibrary.org/obo/SO_0000605"/>
//  <reference name="downstreamIntergenicRegion" referenced-type="IntergenicRegion" term="http://purl.obolibrary.org/obo/SO_0000605"/>
//  <collection name="flankingRegions" referenced-type="GeneFlankingRegion" reverse-reference="gene" term="http://purl.obolibrary.org/obo/SO_0000239"/>
//  <collection name="transcripts" referenced-type="Transcript" reverse-reference="gene"/>
//  <collection name="introns" referenced-type="Intron" reverse-reference="genes" term="http://purl.obolibrary.org/obo/SO_0000188"/>
//  <collection name="proteins" referenced-type="Protein" reverse-reference="genes" term="https://semanticscience.org/resource/SIO_010078"/>
//  <collection name="alleles" referenced-type="Allele" reverse-reference="gene"/>
//  <collection name="panGeneSets" referenced-type="PanGeneSet" reverse-reference="genes"/>
//  <collection name="geneFamilyAssignments" referenced-type="GeneFamilyAssignment"/>
//  <collection name="proteinDomains" referenced-type="ProteinDomain" reverse-reference="genes"/>
//  <collection name="regulatoryRegions" referenced-type="RegulatoryRegion" reverse-reference="gene"/>
//  <collection name="pathways" referenced-type="Pathway" reverse-reference="genes"/>
// </class>
export const intermineGeneAttributesFactory = (type = 'Gene') => [
    ...intermineSequenceFeatureAttributesFactory(type),
    `${type}.briefDescription`,
    `${type}.ensemblName`,
    `${type}.upstreamIntergenicRegion.primaryIdentifier`,   // reference resolution
    `${type}.downstreamIntergenicRegion.primaryIdentifier`, // reference resolution
];
export const intermineGeneAttributes = intermineSequenceFeatureAttributesFactory('Gene');
export const intermineGeneSort = 'Gene.primaryIdentifier';

export type IntermineGene = [
    ...IntermineSequenceFeature,
    string, // briefDescription
    string, // ensemblName
    string, // upstreamIntergenicRegion.primaryIdentifier
    string, // downstreamIntergenicRegion.primaryIdentifier
];

export const graphqlGeneAttributes = [
    ...graphqlSequenceFeatureAttributes,
    'briefDescription',
    'ensemblName',
    'upstreamIntergenicRegionIdentifier',   // resolve IntergenicRegion
    'downstreamIntergenicRegionIdentifier', // resolve IntergenicRegion
];

export type GraphQLGene = {
    [prop in typeof graphqlGeneAttributes[number]]: string;
}

export type IntermineGeneResponse = IntermineDataResponse<IntermineGene>;

// converts an Intermine response into an array of GraphQL Gene objects
export function response2genes(response: IntermineGeneResponse): Array<GraphQLGene> {
    return response2graphqlObjects(response, graphqlGeneAttributes);
}
