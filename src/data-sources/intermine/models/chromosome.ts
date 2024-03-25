import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';


// <class name="Chromosome" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000340,http://purl.obolibrary.org/obo/SO_0000340"></class>
export const intermineChromosomeAttributes = [
    ...intermineSequenceFeatureAttributesFactory('Chromosome'),
];
export const intermineChromosomeSort = 'Chromosome.primaryIdentifier'; // guaranteed not null
export type IntermineChromosome = [
    ...IntermineSequenceFeature,
];


// type Chromosome implements SequenceFeature {
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
export const graphqlChromosomeAttributes = [
    ...graphqlSequenceFeatureAttributes,
];
export type GraphQLChromosome = {
  [prop in typeof graphqlChromosomeAttributes[number]]: string;
}


export type IntermineChromosomeResponse = IntermineDataResponse<IntermineChromosome>;
// converts an Intermine response into an array of GraphQL Chromosome objects
export function response2chromosomes(response: IntermineChromosomeResponse): Array<GraphQLChromosome> {
    return response2graphqlObjects(response, graphqlChromosomeAttributes);
}
