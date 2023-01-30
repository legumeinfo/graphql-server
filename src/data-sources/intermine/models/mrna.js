// <class name="MRNA" extends="Transcript" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000234,http://purl.obolibrary.org/obo/SO_0000234">
// 	<attribute name="isPrimary" type="java.lang.Boolean"/>
// 	<reference name="threePrimeUTR" referenced-type="ThreePrimeUTR"/>
// 	<reference name="fivePrimeUTR" referenced-type="FivePrimeUTR"/>
// </class>
const intermineMRNAAttributes = [
    'MRNA.id',
    'MRNA.primaryIdentifier',
    'MRNA.description',
    'MRNA.symbol',
    'MRNA.name',
    'MRNA.assemblyVersion',
    'MRNA.annotationVersion',
    'MRNA.length',
    'MRNA.organism.taxonId',
    'MRNA.strain.identifier',
    'MRNA.gene.id',
    'MRNA.protein.id',
    'MRNA.isPrimary',
];
const intermineMRNASort = 'MRNA.primaryIdentifier';

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

const graphqlMRNAAttributes = [
    'id',
    'identifier',
    'description',
    'symbol',
    'name',
    'assemblyVersion',
    'annotationVersion',
    'length',
    'organismTaxonId',
    'strainIdentifier',
    'geneId',
    'proteinId',
    'isPrimary',
];

// converts an Intermine response into an array of GraphQL MRNA objects
function response2mRNAs(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlMRNAAttributes);
}


module.exports = {
    intermineMRNAAttributes,
    intermineMRNASort,
    graphqlMRNAAttributes,
    response2mRNAs,
}

