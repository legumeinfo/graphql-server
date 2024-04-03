import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineBioEntity,
  graphqlBioEntityAttributes,
  intermineBioEntityAttributesFactory,
} from './bio-entity.js';


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
export const intermineProteinAttributes = [
    ...intermineBioEntityAttributesFactory('Protein'),
    'Protein.md5checksum',
    'Protein.primaryAccession',
    'Protein.molecularWeight',
    'Protein.length',
    'Protein.isPrimary',
    'Protein.transcript.primaryIdentifier',    // reference resolution
];
export const intermineProteinSort = 'Protein.primaryIdentifier';
export type IntermineProtein = [
  ...IntermineBioEntity,
  string,
  string,
  number,
  number,
  boolean,
  string,
];


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
//   primaryAccession: String
//   molecularWeight: Float
//   length: Int
//   isPrimary: Boolean
//   phylonode: Phylonode
//   # transcript
//   # CDS
//   # sequence
//   genes: [Gene]
//   geneFamilyAssignments: [GeneFamilyAssignment]
//   # proteinMatches
// }
export const graphqlProteinAttributes = [
    ...graphqlBioEntityAttributes,
    'md5checksum',
    'primaryAccession',
    'molecularWeight',
    'length',
    'isPrimary',
    'transcriptIdentifier',
];
export type GraphQLProtein = {
  [prop in typeof graphqlProteinAttributes[number]]: string;
}


export type IntermineProteinResponse = IntermineDataResponse<IntermineProtein>;
// converts an Intermine response into an array of GraphQL Protein objects
export function response2proteins(response: IntermineProteinResponse): Array<GraphQLProtein> {
    return response2graphqlObjects(response, graphqlProteinAttributes);
}
