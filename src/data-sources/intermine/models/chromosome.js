// <class name="Chromosome" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000340,http://purl.obolibrary.org/obo/SO_0000340"></class>
const intermineChromosomeAttributes = [
    'Chromosome.id',
    'Chromosome.primaryIdentifier',
    'Chromosome.description',
    'Chromosome.symbol',
    'Chromosome.name',
    'Chromosome.assemblyVersion',
    'Chromosome.annotationVersion',
    'Chromosome.length',
    'Chromosome.organism.taxonId',        // internal resolution of organism
    'Chromosome.strain.identifier',       // internal resolution of strain
];
const intermineChromosomeSort = 'Chromosome.primaryIdentifier'; // guaranteed not null

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
const graphqlChromosomeAttributes = [
    'id',
    'identifier',
    'description',
    'symbol',
    'name',
    'assemblyVersion',
    'annotationVersion',
    'length',
    'organismTaxonId',              // internal resolution of organism
    'strainIdentifier',             // internal resolution of strain
];

// converts an Intermine response into an array of GraphQL Chromosome objects
function response2chromosomes(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlChromosomeAttributes);
}


module.exports = {
    intermineChromosomeAttributes,
    intermineChromosomeSort,
    graphqlChromosomeAttributes,
    response2chromosomes,
}
