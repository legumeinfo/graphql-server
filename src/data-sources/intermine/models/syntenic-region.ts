import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="SyntenicRegion" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0005858">
// 	<reference name="syntenyBlock" referenced-type="SyntenyBlock" reverse-reference="syntenicRegions"/>
// </class>
export const intermineSyntenicRegionAttributes = [
    'SyntenicRegion.id',
    'SyntenicRegion.primaryIdentifier',
    'SyntenicRegion.description',
    'SyntenicRegion.symbol',
    'SyntenicRegion.name',
    'SyntenicRegion.assemblyVersion',
    'SyntenicRegion.annotationVersion',
    'SyntenicRegion.organism.taxonId',
    'SyntenicRegion.strain.identifier',
    'SyntenicRegion.length',
    'SyntenicRegion.syntenyBlock.id',
];
export const intermineSyntenicRegionSort = 'SyntenicRegion.primaryIdentifier';
export type IntermineSyntenicRegion = [
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
  number,
];


// type SyntenicRegion implements SequenceFeature {
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
//   syntenyBlock: [SyntenyBlock]
// }
export const graphqlSyntenicRegionAttributes = [
    'id',
    'identifier',
    'description',
    'symbol',
    'name',
    'assemblyVersion',
    'annotationVersion',
    'organismTaxonId',
    'strainIdentifier',
    'length',
    'syntenyBlockId',
];
export type GraphQLSyntenicRegion = {
  [prop in typeof graphqlSyntenicRegionAttributes[number]]: string;
}
    

export type IntermineSyntenicRegionResponse = Response<IntermineSyntenicRegion>;
// converts an Intermine response into an array of GraphQL SyntenicRegion objects
export function response2syntenicRegions(response: IntermineSyntenicRegionResponse): Array<GraphQLSyntenicRegion> {
    return response2graphqlObjects(response, graphqlSyntenicRegionAttributes);
}
