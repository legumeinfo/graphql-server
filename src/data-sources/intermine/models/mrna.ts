import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="MRNA" extends="Transcript" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000234,http://purl.obolibrary.org/obo/SO_0000234">
// 	<attribute name="isPrimary" type="java.lang.Boolean"/>
// 	<reference name="threePrimeUTR" referenced-type="ThreePrimeUTR"/>
// 	<reference name="fivePrimeUTR" referenced-type="FivePrimeUTR"/>
// </class>
export const intermineMRNAAttributes = [
    'MRNA.id',
    'MRNA.primaryIdentifier',
    'MRNA.description',
    'MRNA.symbol',
    'MRNA.name',
    'MRNA.assemblyVersion',
    'MRNA.annotationVersion',
    'MRNA.length',
    'MRNA.organism.id',
    'MRNA.strain.id',
    'MRNA.gene.id',
    'MRNA.protein.id',
    'MRNA.isPrimary',
];
export const intermineMRNASort = 'MRNA.primaryIdentifier';
export type IntermineMRNA = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
  number,
  number,
  number,
  number,
  boolean,
];


// type MRNA extends Transcript {
//   id: ID!
//   identifier: String!
//   ontologyAnnotations: [OntologyAnnotation]
//   publications: [Publication]
//   description: String
//   symbol: String
//   name: String
//   assemblyVersion: String
//   annotationVersion: String
//   organism: Organism
//   strain: Strain
//   locations: [Location]
//   # synonyms
//   # crossReferences
//   # dataSets
//   # locatedFeatures
//   # score
//   # scoreType
//   length: Int
//   # sequenceOntologyTerm
//   # supercontigLocation
//   # chromosomeLocation
//   # supercontig
//   # sequence
//   # chromosome
//   # overlappingFeatures
//   # childFeatures
//   gene: Gene
//   protein: Protein
//   # introns
//   # exons
//   # CDSs
//   # UTRs
// }
export const graphqlMRNAAttributes = [
    'id',
    'identifier',
    'description',
    'symbol',
    'name',
    'assemblyVersion',
    'annotationVersion',
    'length',
    'organismId',
    'strainId',
    'geneId',
    'proteinId',
    'isPrimary',
];
export type GraphQLMRNA = {
  [prop in typeof graphqlMRNAAttributes[number]]: string;
}


export type IntermineMRNAResponse = Response<IntermineMRNA>;
// converts an Intermine response into an array of GraphQL MRNA objects
export function response2mRNAs(response: IntermineMRNAResponse): Array<GraphQLMRNA> {
    return response2graphqlObjects(response, graphqlMRNAAttributes);
}
