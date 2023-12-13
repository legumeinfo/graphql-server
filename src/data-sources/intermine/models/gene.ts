import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';


// <class name="Gene" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000704">
// 	<attribute name="briefDescription" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000136"/>
// 	<attribute name="ensemblName" type="java.lang.String"/>
//       <reference name="upstreamIntergenicRegion" referenced-type="IntergenicRegion"/>
//       <reference name="downstreamIntergenicRegion" referenced-type="IntergenicRegion"/>
// 	<collection name="flankingRegions" referenced-type="GeneFlankingRegion" reverse-reference="gene" term="http://purl.obolibrary.org/obo/SO_0000239"/>
// 	<collection name="transcripts" referenced-type="Transcript" reverse-reference="gene"/>
// 	<collection name="introns" referenced-type="Intron" reverse-reference="genes" term="http://purl.obolibrary.org/obo/SO_0000188"/>
// 	<collection name="proteins" referenced-type="Protein" reverse-reference="genes" term="https://semanticscience.org/resource/SIO_010078"/>
// 	<collection name="alleles" referenced-type="Allele" reverse-reference="gene"/>
// 	<collection name="panGeneSets" referenced-type="PanGeneSet" reverse-reference="genes"/>
// 	<collection name="geneFamilyAssignments" referenced-type="GeneFamilyAssignment"/>
// 	<collection name="proteinDomains" referenced-type="ProteinDomain" reverse-reference="genes"/>
// 	<collection name="regulatoryRegions" referenced-type="RegulatoryRegion" reverse-reference="gene"/>
// 	<collection name="pathways" referenced-type="Pathway" reverse-reference="genes"/>
// </class>
export const intermineGeneAttributes = [
    'Gene.id',
    'Gene.primaryIdentifier',
    'Gene.description',
    'Gene.symbol',
    'Gene.name',
    'Gene.assemblyVersion',
    'Gene.annotationVersion',
    'Gene.length',
    'Gene.briefDescription',
    'Gene.organism.taxonId',   // internal resolution of organism
    'Gene.strain.identifier',  // internal resolution of strain
];
export const intermineGeneSort = 'Gene.primaryIdentifier'; // guaranteed not null
export type IntermineGene = [
    number,
    string,
    string,
    string,
    string,
    string,
    string,
    number,
    string,
    number,
    string,
];


// type Gene implements SequenceFeature {
//   id: ID!
//   identifier: String!
//   description: String
//   symbol: String
//   name: String
//   assemblyVersion: String!
//   annotationVersion: String!
//   length: Int
//   strain: Strain
//   geneFamilyAssignments: [GeneFamilyAssignment]
//   proteinDomains: [ProteinDomain]
// }
export const graphqlGeneAttributes = [
    'id',
    'identifier',
    'description',
    'symbol',
    'name',
    'assemblyVersion',
    'annotationVersion',
    'length',
    'briefDescription',
    'organismTaxonId',   // internal resolution of organism
    'strainIdentifier',  // internal resolution of strain
];
export type GraphQLGene = {
    [prop in typeof graphqlGeneAttributes[number]]: string;
}


export type IntermineGeneResponse = IntermineDataResponse<IntermineGene>;
// converts an Intermine response into an array of GraphQL Gene objects
export function response2genes(response: IntermineGeneResponse): Array<GraphQLGene> {
    return response2graphqlObjects(response, graphqlGeneAttributes);
}
