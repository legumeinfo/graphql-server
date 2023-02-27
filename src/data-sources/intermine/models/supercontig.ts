import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="Supercontig" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0000148"></class>
export const intermineSupercontigAttributes = [
    'Supercontig.id',
    'Supercontig.primaryIdentifier',
    'Supercontig.description',
    'Supercontig.symbol',
    'Supercontig.name',
    'Supercontig.assemblyVersion',
    'Supercontig.annotationVersion',
    'Supercontig.length',
    'Supercontig.organism.taxonId',   // internal resolution of organism
    'Supercontig.strain.identifier',  // internal resolution of strain
];
export const intermineSupercontigSort = 'Supercontig.primaryIdentifier'; // guaranteed not null
export type IntermineSupercontig = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  string,
];


// type Supercontig implements SequenceFeature {
//   id: ID!
//   identifier: String!
//   description: String
//   symbol: String
//   name: String
//   assemblyVersion: String
//   annotationVersion: String
//   organism: Organism
//   strain: Strain
//   length: Int
// }
export const graphqlSupercontigAttributes = [
    'id',
    'identifier',
    'description',
    'symbol',
    'name',
    'assemblyVersion',
    'annotationVersion',
    'length',
    'organismTaxonId',  // internal resolution of organism
    'strainIdentifier', // internal resolution of strain
];
export type GraphQLSupercontig = {
  [prop in typeof graphqlSupercontigAttributes[number]]: string;
}


export type IntermineSupercontigResponse = Response<IntermineSupercontig>;
// converts an Intermine response into an array of GraphQL Supercontig objects
export function response2supercontigs(response: IntermineSupercontigResponse): Array<GraphQLSupercontig> {
    return response2graphqlObjects(response, graphqlSupercontigAttributes);
}
