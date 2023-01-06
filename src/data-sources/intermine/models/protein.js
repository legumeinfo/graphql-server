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
    'Protein.description',
    'Protein.symbol',
    'Protein.name',
    'Protein.assemblyVersion',
    'Protein.annotationVersion',
    'Protein.organism.id',
    'Protein.strain.id',
    'Protein.md5checksum',
    'Protein.length',
    'Protein.isPrimary',
];
const intermineProteinSort = 'Protein.primaryIdentifier';

// type Protein implements BioEntity {
//   description: String
//   symbol: String
//   name: String
//   assemblyVersion: String
//   annotationVersion: String
//   organism: Organism
//   strain: Strain
//   # locations
//   # synonyms
//   # crossReferences
//   # dataSets
//   # locatedFeatures
//   md5checksum: String
//   # primaryAccession: String - not populated in LIS mines 5.1.0.1
//   # molecularWeight: Float - not populated in LIS mines 5.1.0.1
//   length: Int
//   isPrimary: Boolean
//   # phylonode: Phylonode - not populated in LIS mines 5.1.0.1
//   # transcript
//   # CDS
//   # sequence
//   genes: [Gene]
//   geneFamilyAssignments: [GeneFamilyAssignment]
//   # proteinMatches
// }
const graphqlProteinAttributes = [
    'id',
    'identifier',
    'description',
    'symbol',
    'name',
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
    return this.pathquery.response2graphqlObjects(response, graphqlProteinAttributes);
}


module.exports = {
    intermineProteinAttributes,
    intermineProteinSort,
    graphqlProteinAttributes,
    response2proteins,
};