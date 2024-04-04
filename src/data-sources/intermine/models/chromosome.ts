import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineSequenceFeature,
  graphqlSequenceFeatureAttributes,
  intermineSequenceFeatureAttributesFactory,
} from './sequence-feature.js';

export const intermineChromosomeAttributes = [
    ...intermineSequenceFeatureAttributesFactory('Chromosome'),
];
export const intermineChromosomeSort = 'Chromosome.primaryIdentifier'; // guaranteed not null
export type IntermineChromosome = [
    ...IntermineSequenceFeature,
];

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
