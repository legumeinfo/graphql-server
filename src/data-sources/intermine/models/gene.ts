import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="Gene" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0000704,http://purl.obolibrary.org/obo/SO:0000704">
// 	<attribute name="primaryIdentifier" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000673"/>
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="symbol" type="java.lang.String" term="http://www.w3.org/2004/02/skos/core#prefLabel"/>
// 	<attribute name="name" type="java.lang.String" term="http://www.w3.org/2000/01/rdf-schema#label"/>
// 	<attribute name="assemblyVersion" type="java.lang.String"/>
// 	<attribute name="annotationVersion" type="java.lang.String"/>
// 	<attribute name="secondaryIdentifier" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000673"/>
// 	<attribute name="briefDescription" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000136"/>
// 	<attribute name="score" type="java.lang.Double" term="http://edamontology.org/data_1772"/>
// 	<attribute name="scoreType" type="java.lang.String" term="http://purl.org/dc/terms/type"/>
// 	<attribute name="length" type="java.lang.Integer" term="http://purl.org/dc/terms/SizeOrDuration"/>
// 	<reference name="organism" referenced-type="Organism" term="http://purl.org/net/orth#organism"/>
// 	<reference name="strain" referenced-type="Strain" term="http://semanticscience.org/resource/SIO_010055"/>
// 	<reference name="sequenceOntologyTerm" referenced-type="SOTerm"/>
// 	<reference name="supercontigLocation" referenced-type="Location"/>
// 	<reference name="chromosomeLocation" referenced-type="Location"/>
// 	<reference name="supercontig" referenced-type="Supercontig"/>
// 	<reference name="sequence" referenced-type="Sequence"/>
// 	<reference name="chromosome" referenced-type="Chromosome" term="http://purl.org/dc/terms/isPartOf"/>
// 	<reference name="upstreamIntergenicRegion" referenced-type="IntergenicRegion"/>
// 	<reference name="downstreamIntergenicRegion" referenced-type="IntergenicRegion"/>
// 	<collection name="ontologyAnnotations" referenced-type="OntologyAnnotation" reverse-reference="subject" term="http://semanticscience.org/resource/SIO_000255"/>
// 	<collection name="publications" referenced-type="Publication" reverse-reference="entities" term="http://purl.org/dc/terms/bibliographicCitation"/>
// 	<collection name="locations" referenced-type="Location" reverse-reference="feature"/>
// 	<collection name="synonyms" referenced-type="Synonym" reverse-reference="subject" term="http://purl.obolibrary.org/obo/synonym"/>
// 	<collection name="crossReferences" referenced-type="CrossReference" reverse-reference="subject" term="http://www.geneontology.org/formats/oboInOwl#hasDbXref"/>
// 	<collection name="dataSets" referenced-type="DataSet" reverse-reference="bioEntities" term="http://semanticscience.org/resource/SIO_001278"/>
// 	<collection name="locatedFeatures" referenced-type="Location" reverse-reference="locatedOn"/>
// 	<collection name="overlappingFeatures" referenced-type="SequenceFeature"/>
// 	<collection name="childFeatures" referenced-type="SequenceFeature"/>
// 	<collection name="flankingRegions" referenced-type="GeneFlankingRegion" reverse-reference="gene"/>
// 	<collection name="transcripts" referenced-type="Transcript" reverse-reference="gene"/>
// 	<collection name="introns" referenced-type="Intron" reverse-reference="genes"/>
// 	<collection name="proteins" referenced-type="Protein" reverse-reference="genes" term="https://semanticscience.org/resource/SIO_010078"/>
// 	<collection name="alleles" referenced-type="Allele" reverse-reference="gene"/>
// 	<collection name="geneFamilyAssignments" referenced-type="GeneFamilyAssignment"/>
// 	<collection name="CDSs" referenced-type="CDS" reverse-reference="gene"/>
// 	<collection name="proteinDomains" referenced-type="ProteinDomain" reverse-reference="genes"/>
// 	<collection name="exons" referenced-type="Exon" reverse-reference="gene"/>
// 	<collection name="pathways" referenced-type="Pathway" reverse-reference="genes"/>
// 	<collection name="regulatoryRegions" referenced-type="RegulatoryRegion" reverse-reference="gene"/>
// 	<collection name="UTRs" referenced-type="UTR" reverse-reference="gene"/>
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


export type IntermineGeneResponse = Response<IntermineGene>;
// converts an Intermine response into an array of GraphQL Gene objects
export function response2genes(response: IntermineGeneResponse): Array<GraphQLGene> {
    return response2graphqlObjects(response, graphqlGeneAttributes);
}
