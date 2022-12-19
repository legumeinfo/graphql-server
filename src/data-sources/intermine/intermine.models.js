// This file contains Intermine models and their corresponding GraphQL models,
// and helper functions to convert between them.
const { response2graphqlObjects } = require('./intermine.pathquery.js');

// --------------------------------------------------------------------------------------
// IMPORTANT NOTE:
// EXTRA attributes (e.g. strain.id => strainId) can be listed here while NOT being
// present in the GraphQL schema. This allows resolution of objects (e.g. Gene.strain)
// without having to include the dependent object ID in the core schema. This is because
// the response2object function uses the path query response, which has the structure of
// the intermineObjectAttributes, and that response is used by the resolvers.
// --------------------------------------------------------------------------------------


// <class name="GeneFamilyAssignment" is-interface="true" term="">
// 	<attribute name="bestDomainScore" type="java.lang.Double"/>
// 	<attribute name="score" type="java.lang.Double"/>
// 	<attribute name="evalue" type="java.lang.Double"/>
// 	<reference name="geneFamily" referenced-type="GeneFamily"/>
// </class>
const intermineGeneFamilyAssignmentAttributes = [
    'GeneFamilyAssignment.id',
    'GeneFamilyAssignment.bestDomainScore',
    'GeneFamilyAssignment.score',
    'GeneFamilyAssignment.evalue',
    'GeneFamilyAssignment.geneFamily.id', // internal resolution of GeneFamily
];
const intermineGeneFamilyAssignmentSort = 'GeneFamilyAssignment.id';
// type GeneFamilyAssignment {
//   id: ID!
//   bestDomainScore: Float
//   score:  Float
//   evalue: Float
//   geneFamily: GeneFamily!
// }
const graphqlGeneFamilyAssignmentAttributes = [
    'id',
    'bestDomainScore',
    'score',
    'evalue',
    'geneFamilyId', // internal resolution of GeneFamily
];
function response2geneFamilyAssignments(response) {
    return response2graphqlObjects(response, graphqlGeneFamilyAssignmentAttributes);
}

// <class name="GeneFamily" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="version" type="java.lang.String"/>
// 	<attribute name="size" type="java.lang.Integer"/>
// 	<reference name="phylotree" referenced-type="Phylotree" reverse-reference="geneFamily"/>
// 	<collection name="genes" referenced-type="Gene"/>
// 	<collection name="proteins" referenced-type="Protein"/>
// 	<collection name="proteinDomains" referenced-type="ProteinDomain" reverse-reference="geneFamilies"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// 	<collection name="tallies" referenced-type="GeneFamilyTally" reverse-reference="geneFamily"/>
// </class>
const intermineGeneFamilyAttributes = [
    'GeneFamily.id',
    'GeneFamily.primaryIdentifier',
    'GeneFamily.description',
    'GeneFamily.version',
    'GeneFamily.size',
    'GeneFamily.phylotree.id', // internal resolution of Phylotree
];
const intermineGeneFamilySort = 'GeneFamily.primaryIdentifier';
// type GeneFamilyAssignment {
//   id: ID!
//   bestDomainScore: Float
//   score:  Float
//   evalue: Float
//   geneFamily: GeneFamily!
// }
const graphqlGeneFamilyAttributes = [
    'id',
    'identifier',
    'description',
    'version',
    'size',
    'phylotreeId', // internal resolution of Phylotree
];
function response2geneFamilies(response) {
    return response2graphqlObjects(response, graphqlGeneFamilyAttributes);
}

// <class name="GWAS" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="genotypingPlatform" type="java.lang.String"/>
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="genotypes" type="java.lang.String"/>
// 	<attribute name="genotypingMethod" type="java.lang.String"/>
// 	<attribute name="synopsis" type="java.lang.String"/>
// 	<reference name="organism" referenced-type="Organism"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="results" referenced-type="GWASResult" reverse-reference="gwas"/>
// </class>
const intermineGWASAttributes = [
    'GWAS.id',
    'GWAS.primaryIdentifier',
    'GWAS.genotypingPlatform',
    'GWAS.description',
    'GWAS.genotypes',
    'GWAS.genotypingMethod',
    'GWAS.synopsis',
    'GWAS.organism.id',
];
const intermineGWASSort = 'GWAS.primaryIdentifier';
// type GWAS {
//   id: ID!
//   identifier: String!
//   # ontologyAnnotations
//   # publications
//   genotypingPlatform: String
//   description: String
//   genotypes: String
//   genotypingMethod: String
//   synopsis: String
//   organism: Organism
//   # dataSet
//   results: [GWASResult]
// }
const graphqlGWASAttributes = [
    'id',
    'identifier',
    'genotypingPlatform',
    'description',
    'genotypes',
    'genotypingMethod',
    'synopsis',
    'organismId',
];
function response2gwas(response) {
    return response2graphqlObjects(response, graphqlGWASAttributes);
}

// <class name="GWASResult" is-interface="true" term="">
// 	<attribute name="pValue" type="java.lang.Double"/>
//      <attribute name="markerName" type="java.lang.String"/>
// 	<reference name="gwas" referenced-type="GWAS" reverse-reference="results"/>
// 	<reference name="trait" referenced-type="Trait" reverse-reference="gwasResults"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="markers" referenced-type="GeneticMarker" reverse-reference="gwasResults"/>
// </class>
const intermineGWASResultAttributes = [
    'GWASResult.id',
    'GWASResult.pValue',
    'GWASResult.markerName',
    'GWASResult.gwas.id',
    'GWASResult.trait.id',
];
const intermineGWASResultSort = 'GWASResult.markerName';
// type GWASResult {
//   id: ID!
//   pValue: Float
//   markerName: String
//   # gwas: GWAS
//   trait: Trait
//   # dataSet
//   # markers
// }
const graphqlGWASResultAttributes = [
    'id',
    'pValue',
    'markerName',
    'gwasId',
    'traitId',
];
function response2gwasResults(response) {
    return response2graphqlObjects(response, graphqlGWASResultAttributes);
}

// <class name="Ontology" is-interface="true" term="http://semanticscience.org/resource/SIO_001391">
// 	<attribute name="url" type="java.lang.String" term="http://edamontology.org/data_1052"/>
// 	<attribute name="name" type="java.lang.String" term="http://www.w3.org/2000/01/rdf-schema#label"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
const intermineOntologyAttributes = [
    'Ontology.id',
    'Ontology.url',
    'Ontology.name',
]
const intermineOntologySort = 'Ontology.name';
// type Ontology {
//   id: ID!
//   url: String
//   name: String
//   # dataSets
// }
const graphqlOntologyAttributes = [
    'id',
    'url',
    'name',
]
function response2ontologies(response) {
    return response2graphqlObjects(response, graphqlOntologyAttributes);
}

// <class name="OntologyTerm" is-interface="true" term="http://semanticscience.org/resource/SIO_000275">
// 	<attribute name="identifier" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000675"/>
// 	<attribute name="description" type="java.lang.String" term="http://purl.org/dc/terms/description"/>
// 	<attribute name="obsolete" type="java.lang.Boolean" term="http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#C63553"/>
// 	<attribute name="name" type="java.lang.String" term="http://www.w3.org/2000/01/rdf-schema#label"/>
// 	<attribute name="namespace" type="java.lang.String" term="http://semanticscience.org/resource/SIO_000067"/>
// 	<reference name="ontology" referenced-type="Ontology"/>
// 	<collection name="relations" referenced-type="OntologyRelation"/>
// 	<collection name="synonyms" referenced-type="OntologyTermSynonym"/>
// 	<collection name="ontologyAnnotations" referenced-type="OntologyAnnotation" reverse-reference="ontologyTerm"/>
// 	<collection name="parents" referenced-type="OntologyTerm"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// 	<collection name="crossReferences" referenced-type="OntologyTerm"/>
// </class>
const intermineOntologyTermAttributes = [
    'OntologyTerm.id',
    'OntologyTerm.identifier',
    'OntologyTerm.description',   
    'OntologyTerm.obsolete',
    'OntologyTerm.name',
    'OntologyTerm.namespace',
    'OntologyTerm.ontology.id',
]
const intermineOntologyTermSort = 'OntologyTerm.identifier';
// type OntologyTerm {
//   id: ID!
//   identifier: String!
//   description: String
//   obsolete: Boolean
//   name: String
//   namespace: String
//   # ontology
//   # relations
//   # synonyms
//   # ontologyAnnotations
//   # parents
//   # dataSets
//   # crossReferences
// }
const graphqlOntologyTermAttributes = [
    'id',
    'identifier',
    'description',
    'obsolete',
    'name',
    'namespace',
    'ontologyId',
];
function response2ontologyTerms(response) {
    return response2graphqlObjects(response, graphqlOntologyTermAttributes);
}

// <class name="Organism" is-interface="true" term="http://semanticscience.org/resource/SIO_010000">
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
// </class>    
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
// type Organism {
//   id: ID!
//   taxonId: Int!
//   abbreviation: String
//   name: String
//   commonName: String
//   description: String
//   genus: String
//   species: String
//   strains: [Strain!]
// }
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
function response2organisms(response) {
    return response2graphqlObjects(response, graphqlOrganismAttributes);
}

// Phylonode InterMine path query attributes
// <class name="Phylonode" is-interface="true" term="">
// 	<attribute name="identifier" type="java.lang.String"/>
// 	<attribute name="isRoot" type="java.lang.Boolean"/>
// 	<attribute name="length" type="java.lang.Double"/>
// 	<attribute name="numChildren" type="java.lang.Integer"/>
// 	<attribute name="isLeaf" type="java.lang.Boolean"/>
// 	<reference name="protein" referenced-type="Protein" reverse-reference="phylonode"/>
// 	<reference name="tree" referenced-type="Phylotree" reverse-reference="nodes"/>
// 	<reference name="parent" referenced-type="Phylonode" reverse-reference="children"/>
// 	<collection name="children" referenced-type="Phylonode" reverse-reference="parent"/>
// </class>
const interminePhylonodeAttributes = [
    'Phylonode.id',
    'Phylonode.identifier',
    'Phylonode.isRoot',
    'Phylonode.length',
    'Phylonode.numChildren',
    'Phylonode.isLeaf',
    'Phylonode.tree.id',
    'Phylonode.parent.id',
];
const interminePhylonodeSort = 'Phylonode.identifier';

const graphqlPhylonodeAttributes = [
    'id',
    'identifier',
    'isRoot',
    'length',
    'numChildren',
    'isLeaf',
    'treeId',
    'parentId',
];

function response2phylonodes(response) {
    return response2graphqlObjects(response, graphqlPhylonodeAttributes);
}

// Phylotree InterMine path query attributes
// <class name="Phylotree" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="numLeaves" type="java.lang.Integer"/>
// 	<reference name="geneFamily" referenced-type="GeneFamily" reverse-reference="phylotree"/>
// 	<collection name="nodes" referenced-type="Phylonode" reverse-reference="tree"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
const interminePhylotreeAttributes = [
    'Phylotree.id',
    'Phylotree.primaryIdentifier',
    'Phylotree.numLeaves',
    'Phylotree.geneFamily.id',
];
const interminePhylotreeSort = 'Phylotree.primaryIdentifier';

const graphqlPhylotreeAttributes = [
    'id',
    'identifier',
    'numLeaves',
    'geneFamilyId',
];

function response2phylotrees(response) {
    return response2graphqlObjects(response, graphqlPhylotreeAttributes);
}

// Protein InterMine path query attributes
// <class name="Protein" extends="BioEntity" is-interface="true" term="http://semanticscience.org/resource/SIO_010043,http://purl.uniprot.org/core/Protein">
// 	<attribute name="md5checksum" type="java.lang.String" term="http://purl.uniprot.org/core/md5Checksum"/>
// 	<attribute name="primaryAccession" type="java.lang.String" term="http://purl.obolibrary.org/obo/ERO_0000405"/>
// 	<attribute name="molecularWeight" type="java.lang.Double" term="http://purl.uniprot.org/core/mass"/>
// 	<attribute name="length" type="java.lang.Integer" term="http://purl.org/dc/terms/SizeOrDuration"/>
// 	<attribute name="isPrimary" type="java.lang.Boolean"/>
// 	<reference name="phylonode" referenced-type="Phylonode" reverse-reference="protein"/>
// 	<reference name="transcript" referenced-type="Transcript" reverse-reference="protein"/>
// 	<reference name="CDS" referenced-type="CDS" reverse-reference="protein"/>
// 	<reference name="sequence" referenced-type="Sequence" term="http://purl.uniprot.org/core/sequence"/>
// 	<collection name="genes" referenced-type="Gene" reverse-reference="proteins" term="http://semanticscience.org/resource/SIO_010079"/>
// 	<collection name="geneFamilyAssignments" referenced-type="GeneFamilyAssignment"/>
// 	<collection name="proteinMatches" referenced-type="ProteinMatch" reverse-reference="protein"/>
// </class>
const intermineProteinAttributes = [
    'Protein.id',
    'Protein.primaryIdentifier',
    'Protein.assemblyVersion',
    'Protein.annotationVersion',
    'Protein.organism.id',
    'Protein.strain.id',
    'Protein.md5checksum',
    'Protein.length',
    'Protein.isPrimary',
];
const intermineProteinSort = 'Protein.primaryIdentifier';

// Protein GraphQL attributes
// id: ID!
// identifier: String!
// # ontologyAnnotations
// # publications
// # description: String
// # symbol: String
// # name: String
// assemblyVersion: String
// annotationVersion: String
// organism: Organism
// strain: Strain
// # locations
// # synonyms
// # crossReferences
// # dataSets
// # locatedFeatures
// md5checksum: String
// # primaryAccession: String
// # molecularWeight: Float
// length: Int
// isPrimary: Boolean
// # phylonode: Phylonode
// # transcript
// # CDS
// # sequence
// genes: [Gene]
// geneFamilyAssignments: [GeneFamilyAssignment]
// # proteinMatches
const graphqlProteinAttributes = [
    'id',
    'identifier',
    'assemblyVersion',
    'annotationVersion',
    'organismId',
    'strainId',
    'md5checksum',
    'length',
    'isPrimary',
];

// converts an Intermine response into an array of GraphQL Protein objects
function response2proteins(response) {
    return response2graphqlObjects(response, graphqlProteinAttributes);
}

// ProteinDomain InterMine path query attributes
// <class name="ProteinDomain" extends="Annotatable" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000417">
//  	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="type" type="java.lang.String"/>
// 	<attribute name="name" type="java.lang.String"/>
//	<attribute name="shortName" type="java.lang.String"/>
// 	<collection name="genes" referenced-type="Gene" reverse-reference="proteinDomains"/>
// 	<collection name="geneFamilies" referenced-type="GeneFamily" reverse-reference="proteinDomains"/>
// 	<collection name="childFeatures" referenced-type="ProteinDomain"/>
// 	<collection name="foundIn" referenced-type="ProteinDomain"/>
// 	<collection name="parentFeatures" referenced-type="ProteinDomain"/>
// 	<collection name="contains" referenced-type="ProteinDomain"/>
// </class>
const intermineProteinDomainAttributes = [
    'ProteinDomain.id',
    'ProteinDomain.primaryIdentifier',
    'ProteinDomain.description',
    'ProteinDomain.type',
    'ProteinDomain.name',
    'ProteinDomain.shortName',
];
const intermineProteinDomainSort = 'ProteinDomain.primaryIdentifier';

// the attributes of a ProteinDomain in the GraphQL API
// id: ID!
// identifier: String!
// # ontologyAnnotations
// # publications
// description: String
// type: String
// name: String
// shortName: String
// genes: [Gene]
// geneFamilies: [GeneFamily]
// # childFeatures: [ProteinDomain]
// # foundIn: [ProteinDomain]
// # parentFeatures: [ProteinDomain]
// # contains: [ProteinDomain]
const graphqlProteinDomainAttributes = [
    'id',
    'identifier',
    'description',
    'type',
    'name',
    'shortName',
];

// converts an Intermine response into an array of GraphQL ProteinDomain objects
function response2proteinDomains(response) {
    return response2graphqlObjects(response, graphqlProteinDomainAttributes);
}

// <class name="QTL" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0001645">
// 	<attribute name="identifier" type="java.lang.String"/>
// 	<attribute name="lod" type="java.lang.Double"/>
// 	<attribute name="likelihoodRatio" type="java.lang.Double"/>
// 	<attribute name="end" type="java.lang.Double"/>
// 	<attribute name="markerNames" type="java.lang.String"/>
// 	<attribute name="markerR2" type="java.lang.Double"/>
// 	<attribute name="start" type="java.lang.Double"/>
// 	<attribute name="peak" type="java.lang.Double"/>
// 	<reference name="trait" referenced-type="Trait" reverse-reference="qtls"/>
// 	<reference name="qtlStudy" referenced-type="QTLStudy" reverse-reference="qtls"/>
// 	<reference name="linkageGroup" referenced-type="LinkageGroup" reverse-reference="qtls"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="genes" referenced-type="Gene"/>
// 	<collection name="markers" referenced-type="GeneticMarker" reverse-reference="qtls"/>
// </class>
const intermineQTLAttributes = [
    'QTL.id',
    'QTL.identifier',
    'QTL.end',
    'QTL.markerNames',
    'QTL.start',
    'QTL.trait.id',
];
const intermineQTLSort = 'QTL.identifier';
// type QTL {
//   id: ID!
//   identifier: String!
//   # lod: Float
//   # likelihoodRatio: Float
//   end: Float
//   markerNames: String
//   # markerR2
//   start: Float
//   # peak
//   trait: Trait
//   # qtlStudy: QTLStudy
//   # linkageGroup
//   # dataSet: DataSet
//   # genes: [Gene]
//   # markers: [GeneticMarker]
// }
const graphqlQTLAttributes = [
    'id',
    'identifier',
    'end',
    'markerNames',
    'start',
    'traitId',
];
function response2qtls(response) {
    return response2graphqlObjects(response, graphqlQTLAttributes);
}

// <class name="Strain" is-interface="true" term="http://semanticscience.org/resource/SIO_010055">
// 	<attribute name="identifier" type="java.lang.String" term="http://edamontology.org/data_2379"/>
// 	<attribute name="name" type="java.lang.String" term="http://edamontology.org/data_1046"/>
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="origin" type="java.lang.String"/>
//	<attribute name="accession" type="java.lang.String" term="http://edamontology.org/data_2912"/>
// 	<reference name="organism" referenced-type="Organism" reverse-reference="strains" term="http://purl.org/net/orth#organism"/>
//      <collection name="dataSets" referenced-type="DataSet"/>
// </class>
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
// type Strain {
//   id: ID!
//   identifier: String!
//   name: String
//   description: String
//   origin: String
//   accession: String
//   organism: Organism
// }
const graphqlStrainAttributes = [
    'id',
    'identifier',
    'name',
    'description',
    'origin',
    'accession',
    'organismId',    // internal resolution of organism
];
function response2strains(response) {
    return response2graphqlObjects(response, graphqlStrainAttributes);
}

// <class name="Trait" is-interface="true" term="https://browser.planteome.org/amigo/term/TO:0000387">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="name" type="java.lang.String"/>
// 	<reference name="qtlStudy" referenced-type="QTLStudy"/>
// 	<reference name="gwas" referenced-type="GWAS"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="trait"/>
// 	<collection name="ontologyTerms" referenced-type="OntologyTerm"/>
// 	<collection name="gwasResults" referenced-type="GWASResult" reverse-reference="trait"/>
// </class>
// NOTE: one of Trait.qtlStudy or Trait.gwas is null, so we cannot grab those IDs here.
const intermineTraitAttributes = [
    'Trait.id',
    'Trait.description',
    'Trait.name',
];
const intermineTraitSort = 'Trait.name';
const graphqlTraitAttributes = [
    'id',
    'description',
    'name',
];
function response2traits(response) {
    return response2graphqlObjects(response, graphqlTraitAttributes);
}


// -------------
// Special cases
// -------------

// GeneFamilyAssignment does not have reverse reference - have to query Gene
const intermineGeneGeneFamilyAssignmentsAttributes = [
    'Gene.geneFamilyAssignments.id',
    'Gene.geneFamilyAssignments.bestDomainScore',
    'Gene.geneFamilyAssignments.score',
    'Gene.geneFamilyAssignments.evalue',
    'Gene.geneFamilyAssignments.geneFamily.id', // internal resolution of GeneFamily
];
const intermineGeneGeneFamilyAssignmentsSort = 'Gene.geneFamilyAssignments.geneFamily.primaryIdentifier';

// GeneFamilyAssignment does not have reverse reference - have to query Protein
const intermineProteinGeneFamilyAssignmentsAttributes = [
    'Protein.geneFamilyAssignments.id',
    'Protein.geneFamilyAssignments.bestDomainScore',
    'Protein.geneFamilyAssignments.score',
    'Protein.geneFamilyAssignments.evalue',
    'Protein.geneFamilyAssignments.geneFamily.id', // internal resolution of GeneFamily
];
const intermineProteinGeneFamilyAssignmentsSort = 'Protein.geneFamilyAssignments.geneFamily.primaryIdentifier';

// Trait.ontologyTerms has no reverse reference. (Should probably be stored in OntologyAnnotation.)
const intermineTraitOntologyTermsAttributes = [
    'Trait.ontologyTerms.id',
    'Trait.ontologyTerms.identifier',
    'Trait.ontologyTerms.description',   
    'Trait.ontologyTerms.obsolete',
    'Trait.ontologyTerms.name',
    'Trait.ontologyTerms.namespace',
    'Trait.ontologyTerms.ontology.id',
];
const intermineTraitOntologyTermsSort = 'Trait.ontologyTerms.identifier';


const {
    intermineGeneAttributes,
    intermineGeneSort,
    graphqlGeneAttributes,
    response2genes,
} = require('./models/gene.js');


// --------------------------------------
// Each object has FOUR exports:
//   intermineObjectAttributes,
//   intermineObjectSort,
//   graphqlObjectAttributes,
//   response2objects
// --------------------------------------
module.exports = {

    // Gene
    intermineGeneAttributes,
    intermineGeneSort,
    graphqlGeneAttributes,
    response2genes,

    // GeneFamilyAssignment
    intermineGeneFamilyAssignmentAttributes,
    intermineGeneFamilyAssignmentSort,
    graphqlGeneFamilyAssignmentAttributes,
    response2geneFamilyAssignments,

    // GeneFamily
    intermineGeneFamilyAttributes,
    intermineGeneFamilySort,
    graphqlGeneFamilyAttributes,
    response2geneFamilies,

    // GWAS
    intermineGWASAttributes,
    intermineGWASSort,
    graphqlGWASAttributes,
    response2gwas,

    // GWASResult
    intermineGWASResultAttributes,
    intermineGWASResultSort,
    graphqlGWASResultAttributes,
    response2gwasResults,
    
    // Organism
    intermineOrganismAttributes,
    intermineOrganismSort,
    graphqlOrganismAttributes,
    response2organisms,

    // Ontology
    intermineOntologyAttributes,
    intermineOntologySort,
    graphqlOntologyAttributes,
    response2ontologies,

    // OntologyTerm
    intermineOntologyTermAttributes,
    intermineOntologyTermSort,
    graphqlOntologyTermAttributes,
    response2ontologyTerms,
    
    // Phylonode
    interminePhylonodeAttributes,
    interminePhylonodeSort,
    graphqlPhylonodeAttributes,
    response2phylonodes,

    // Phylotree
    interminePhylotreeAttributes,
    interminePhylotreeSort,
    graphqlPhylotreeAttributes,
    response2phylotrees,

    // Protein
    intermineProteinAttributes,
    intermineProteinSort,
    graphqlProteinAttributes,
    response2proteins,

    // ProteinDomain
    intermineProteinDomainAttributes,
    intermineProteinDomainSort,
    graphqlProteinDomainAttributes,
    response2proteinDomains,

    // QTL
    intermineQTLAttributes,
    intermineQTLSort,
    graphqlQTLAttributes,
    response2qtls,
    
    // Strain
    intermineStrainAttributes,
    intermineStrainSort,
    graphqlStrainAttributes,
    response2strains,

    // Trait
    intermineTraitAttributes,
    intermineTraitSort,
    graphqlTraitAttributes,
    response2traits,

    // -------------
    // Special cases
    // -------------

    // Gene.geneFamilyAssignments
    intermineGeneGeneFamilyAssignmentsAttributes,
    intermineGeneGeneFamilyAssignmentsSort,

    // Protein.geneFamilyAssignments
    intermineProteinGeneFamilyAssignmentsAttributes,
    intermineProteinGeneFamilyAssignmentsSort,

    // Trait.ontologyTerms
    intermineTraitOntologyTermsAttributes,
    intermineTraitOntologyTermsSort,
    
};
