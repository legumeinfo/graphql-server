import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import { IntermineBioEntity, graphqlBioEntityAttributes } from './bio-entity.js';

// <class name="Protein" extends="BioEntity" is-interface="true" term="http://semanticscience.org/resource/SIO_010043,http://purl.uniprot.org/core/Protein">
// 	<attribute name="md5checksum" type="java.lang.String" term="http://purl.uniprot.org/core/md5Checksum"/>
// 	<attribute name="primaryAccession" type="java.lang.String" term="http://purl.obolibrary.org/obo/ERO_0000405"/>
// 	<attribute name="molecularWeight" type="java.lang.Double" term="http://purl.uniprot.org/core/mass"/>
// 	<attribute name="length" type="java.lang.Integer" term="http://purl.org/dc/terms/SizeOrDuration"/>
// 	<attribute name="isPrimary" type="java.lang.Boolean"/>
// 	<reference name="phylonode" referenced-type="Phylonode" reverse-reference="protein"/>
// 	<reference name="transcript" referenced-type="Transcript" reverse-reference="protein" term="http://purl.obolibrary.org/obo/SO_0000673"/>
// 	<reference name="sequence" referenced-type="Sequence" term="http://purl.uniprot.org/core/sequence"/>
// 	<collection name="genes" referenced-type="Gene" reverse-reference="proteins" term="http://semanticscience.org/resource/SIO_010079"/>
// 	<collection name="proteinMatches" referenced-type="ProteinMatch" term="http://purl.obolibrary.org/obo/SO:0000349"/>
// 	<collection name="panGeneSets" referenced-type="PanGeneSet" reverse-reference="proteins"/>
// 	<collection name="geneFamilyAssignments" referenced-type="GeneFamilyAssignment"/>
// </class>
export const intermineProteinAttributes = [
    'Protein.id',
    'Protein.primaryIdentifier',   // Annotatable
    'Protein.description',         // BioEntity
    'Protein.symbol',              // BioEntity
    'Protein.name',                // BioEntity
    'Protein.assemblyVersion',     // BioEntity
    'Protein.annotationVersion',   // BioEntity
    'Protein.secondaryIdentifier', // BioEntity
    'Protein.organism.taxonId',    // BioEntity - resolve reference
    'Protein.strain.identifier',   // BioEntity - resolve reference
    'Protein.md5checksum',
    'Protein.primaryAccession',
    'Protein.molecularWeight',
    'Protein.length',
    'Protein.isPrimary',
    'Protein.phylonode.identifier',         // resolve reference
    'Protein.transcript.primaryIdentifier', // resolve reference
    'Protein.sequence.id',                  // resolve reference
];

export const intermineProteinSort = 'Protein.primaryIdentifier';

export type IntermineProtein = [
    ...IntermineBioEntity,
    string, // md5checksum
    string, // primaryAccession
    number, // molecularWeight
    number, // length
    boolean, // isPrimary
    string, // phylonode.identifier
    string, // transcript.primaryIdentifier
    number, // sequence.id
];

export const graphqlProteinAttributes = [
    ...graphqlBioEntityAttributes,
    'md5checksum',
    'primaryAccession',
    'molecularWeight',
    'length',
    'isPrimary',
    'phylonodeIdentifier',  // resolve Phylonode
    'transcriptIdentifier', // resolve Transcript
    'sequenceId',           // resolve Sequence
];

export type GraphQLProtein = {
    [prop in typeof graphqlProteinAttributes[number]]: string;
}

export type IntermineProteinResponse = IntermineDataResponse<IntermineProtein>;

// converts an Intermine response into an array of GraphQL Protein objects
export function response2proteins(response: IntermineProteinResponse): Array<GraphQLProtein> {
    return response2graphqlObjects(response, graphqlProteinAttributes);
}
