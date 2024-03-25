import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';


// <class name="Supercontig" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0000148"></class>
export const intermineSupercontigAttributes = [
    ...intermineSequenceFeatureAttributesFactory('Supercontig'),
];
export const intermineSupercontigSort = 'Supercontig.primaryIdentifier'; // guaranteed not null
export type IntermineSupercontig = [
    ...IntermineSequenceFeature,
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
    ...graphqlSequenceFeatureAttributes,
];
export type GraphQLSupercontig = {
  [prop in typeof graphqlSupercontigAttributes[number]]: string;
}


export type IntermineSupercontigResponse = IntermineDataResponse<IntermineSupercontig>;
// converts an Intermine response into an array of GraphQL Supercontig objects
export function response2supercontigs(response: IntermineSupercontigResponse): Array<GraphQLSupercontig> {
    return response2graphqlObjects(response, graphqlSupercontigAttributes);
}
