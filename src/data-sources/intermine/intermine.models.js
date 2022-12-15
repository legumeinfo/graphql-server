// This file contains Intermine models and their corresponding GraphQL models,
// and helper functions to convert between them.
const { response2graphqlObjects } = require('./intermine.pathquery.js');

////////////////////////////////////////////////////////////////////////////////////////
// IMPORTANT NOTE:                                                                    //
// EXTRA "GraphQL API" attributes (e.g. strain.id => strainId) can be listed here     //
// while NOT being present in the GraphQL schema. This allows resolution of objects   //
// (e.g. Gene.strain) without having to include the ID in the core schema.            //
// This is because the response2object function uses the response which has the       //
// structure of the intermineObjectAttributes, and that resulting structure is used   //
// by the resolvers.                                                                  //
////////////////////////////////////////////////////////////////////////////////////////

// Organism InterMine data model
// 	<attribute name="taxonId" type="java.lang.String" term="http://edamontology.org/data_1179"/>
// 	<attribute name="abbreviation" type="java.lang.String"/>
// 	<attribute name="name" type="java.lang.String" term="http://www.w3.org/2000/01/rdf-schema//label"/>
// 	<attribute name="commonName" type="java.lang.String" term="http://edamontology.org/data_2909"/>
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="genus" type="java.lang.String" term="http://edamontology.org/data_1870"/>
// 	<attribute name="species" type="java.lang.String" term="http://edamontology.org/data_1045"/>
// 	<attribute name="shortName" type="java.lang.String" term="http://edamontology.org/data_2909"/>
// 	<collection name="strains" referenced-type="Strain" reverse-reference="organism"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
const intermineOrganismAttributes = [
    'Organism.id',
    'Organism.taxonId',
    'Organism.abbreviation',
    'Organism.name',
    'Organism.commonName',
    'Organism.description',
    'Organism.genus',
    'Organism.species',
    'Organism.shortName',
];

const intermineOrganismSort = 'Organism.taxonId'; // guaranteed not null

// Organism GraphQL schema
// id: ID!
// taxonId: Int!
// abbreviation: String
// name: String
// commonName: String
// description: String
// genus: String
// species: String
// strains: [Strain!]
const graphqlOrganismAttributes = [
    'id',
    'taxonId',
    'abbreviation',
    'name',
    'commonName',
    'description',
    'genus',
    'species',
];

// convert an InterMine path query response into an array of GraphQL Organism objects
function response2organisms(response) {
    return response2graphqlObjects(response, graphqlOrganismAttributes);
}


// Strain InterMine data model
// 	<attribute name="identifier" type="java.lang.String" term="http://edamontology.org/data_2379"/>
// 	<attribute name="name" type="java.lang.String" term="http://edamontology.org/data_1046"/>
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="origin" type="java.lang.String"/>
//	<attribute name="accession" type="java.lang.String" term="http://edamontology.org/data_2912"/>
// 	<reference name="organism" referenced-type="Organism" reverse-reference="strains" term="http://purl.org/net/orth#organism"/>
//      <collection name="dataSets" referenced-type="DataSet"/>
const intermineStrainAttributes = [
    'Strain.id',
    'Strain.identifier',
    'Strain.name',
    'Strain.description',
    'Strain.origin',
    'Strain.accession',
    'Strain.organism.id', // internal resolution of organism
];

const intermineStrainSort = 'Strain.identifier'; // guaranteed not null

// Strain GraphQL schema
// id: ID!
// identifier: String!
// name: String
// description: String
// origin: String
// accession: String
// organism: Organism
const graphqlStrainAttributes = [
    'id',
    'identifier',
    'name',
    'description',
    'origin',
    'accession',
    'organismId', // internal resolution of organism
];

// converts an Intermine response into an array of GraphQL Strain objects
function response2strains(response) {
    return response2graphqlObjects(response, graphqlStrainAttributes);
}


// Gene InterMine data model
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
const intermineGeneAttributes = [
    'Gene.id',
    'Gene.primaryIdentifier',
    'Gene.description',
    'Gene.symbol',
    'Gene.name',
    'Gene.assemblyVersion',
    'Gene.annotationVersion',
    'Gene.length',
    'Gene.strain.id',          // internal resolution of Gene.strain
];

const intermineGeneSort = 'Gene.primaryIdentifier'; // guaranteed not null

// Gene GraphQL schema
// id: ID!
// identifier: String!
// description: String
// symbol: String
// name: String
// assembly: String!
// annotation: String!
// length: Int
// strain: Strain
// geneFamilyAssignments: [GeneFamilyAssignment]
// proteinDomains: [ProteinDomain]
const graphqlGeneAttributes = [
    'id',
    'identifier',
    'description',
    'symbol',
    'name',
    'assembly',
    'annotation',
    'length',
    'strainId',                // internal resolution of Gene.strain
];

// converts an Intermine response into an array of GraphQL Gene objects
function response2genes(response) {
    return response2graphqlObjects(response, graphqlGeneAttributes);
}


// the attributes of a Gene's protein domains in InterMine
const intermineGeneProteinDomainAttributes = [
    'Gene.proteinDomains.id',
    'Gene.proteinDomains.primaryIdentifier',
    'Gene.proteinDomains.name',
    'Gene.proteinDomains.shortName',
    'Gene.proteinDomains.type',
];
// the attributes of a ProteinDomain in the GraphQL API
// id: ID!
// identifier: String!
// name: String
// shortName: String
// type: String
// genes: [Gene]
// geneFamilies: [GeneFamily]
// childFeatures: [ProteinDomain]
// foundIn: [ProteinDomain]
// parentFeatures: [ProteinDomain]
// contains: [ProteinDomain]
const graphqlProteinDomainAttributes = [
    'id',
    'identifier',
    'name',
    'shortName',
    'type',
];

const intermineGeneProteinDomainSort = 'Gene.proteinDomains.primaryIdentifier';

// converts an Intermine response into an array of GraphQL ProteinDomain objects
function response2proteindomains(response) {
    return response2graphqlObjects(response, graphqlProteinDomainAttributes);
}

// the attributes of GeneFamilyAssignment in InterMine w.r.t. a Gene
const intermineGeneFamilyAssignmentAttributes = [
    'Gene.geneFamilyAssignments.id',
    'Gene.geneFamilyAssignments.geneFamily.id',
    'Gene.geneFamilyAssignments.score',
    'Gene.geneFamilyAssignments.evalue',
    'Gene.geneFamilyAssignments.bestDomainScore',
];
// the corresponding attributes of GeneFamilyAssignment in GraphQL
const graphqlGeneFamilyAssignmentAttributes = [
    'id',
    'geneFamilyId',
    'score',
    'evalue',
    'bestDomainScore',
];
// converts an Intermine response into an array of GraphQL Gene Family objects
function response2geneFamilyAssignments(response) {
    return response2graphqlObjects(response, graphqlGeneFamilyAssignmentAttributes);
}


// the attributes of a Gene Family in InterMine
const intermineGeneFamilyAttributes = [
    'GeneFamily.id',
    'GeneFamily.identifier',
    'GeneFamily.description',
];
// the attributes of a Gene Family in the GraphQL API
const graphqlGeneFamilyAttributes = [
    'id',
    'identifier',
    'description',
];
// converts an Intermine response into an array of GraphQL Gene Family objects
function response2geneFamilies(response) {
    return response2graphqlObjects(response, graphqlGeneFamilyAttributes);
}


// the attributes of a Trait in InterMine
// Note: collections like gwas may be empty, in which case the query returns
// null if they are in the query. Only attributes, not references or collections, can
// be guaranteed to exist and result in a non-null response (unless there is an ironclad
// guarantee that references or collections are populated, which is unlikely).
const intermineTraitAttributes = [
    'Trait.id',
    'Trait.name',
    'Trait.description',
];
// the attributes of a Trait in the GraphQL API
const graphqlTraitAttributes = [
    'id',
    'name',
    'description',
];
// converts an Intermine response into an array of GraphQL Trait objects
function response2traits(response) {
    return response2graphqlObjects(response, graphqlTraitAttributes);
}


module.exports = {
    // Organism
    intermineOrganismAttributes,
    intermineOrganismSort,
    graphqlOrganismAttributes,
    response2organisms,
    // Strain
    intermineStrainAttributes,
    intermineStrainSort,
    graphqlStrainAttributes,
    response2strains,
    // Gene
    intermineGeneAttributes,
    intermineGeneSort,
    intermineGeneProteinDomainAttributes,
    intermineGeneProteinDomainSort,
    graphqlGeneAttributes,
    response2genes,
    // ProteinDomain
    graphqlProteinDomainAttributes,
    response2proteindomains,
    // GeneFamily
    intermineGeneFamilyAttributes,
    graphqlGeneFamilyAttributes,
    response2geneFamilies,
    // Trait
    intermineTraitAttributes,
    graphqlTraitAttributes,
    response2traits,
};
