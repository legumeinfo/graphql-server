import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="Chromosome" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000340,http://purl.obolibrary.org/obo/SO_0000340"></class>
export const intermineChromosomeAttributes = [
    'Chromosome.id',
    'Chromosome.primaryIdentifier',
    'Chromosome.description',
    'Chromosome.symbol',
    'Chromosome.name',
    'Chromosome.assemblyVersion',
    'Chromosome.annotationVersion',
    'Chromosome.length',
    'Chromosome.organism.id',        // internal resolution of organism
    'Chromosome.strain.id',          // internal resolution of strain
];
export const intermineChromosomeSort = 'Chromosome.primaryIdentifier'; // guaranteed not null
export type IntermineChromosome = [
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
    'id',
    'identifier',
    'description',
    'symbol',
    'name',
    'assemblyVersion',
    'annotationVersion',
    'length',
    'organismId',              // internal resolution of organism
    'strainId',                // internal resolution of strain
];
export type GraphQLChromosome = {
  [prop in typeof graphqlChromosomeAttributes[number]]: string;
}


export type IntermineChromosomeResponse = Response<IntermineChromosome>;
// converts an Intermine response into an array of GraphQL Chromosome objects
export function response2chromosomes(response: IntermineChromosomeResponse): Array<GraphQLChromosome> {
    return response2graphqlObjects(response, graphqlChromosomeAttributes);
}
