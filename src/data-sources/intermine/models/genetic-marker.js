// <class name="GeneticMarker" extends="SequenceFeature" is-interface="true" term="http://purl.obolibrary.org/obo/SO_0001645">
// 	<attribute name="genotypingPlatform" type="java.lang.String"/>
// 	<attribute name="motif" type="java.lang.String"/>
// 	<attribute name="alias" type="java.lang.String"/>
// 	<attribute name="type" type="java.lang.String"/>
// 	<attribute name="alleles" type="java.lang.String"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="markers"/>
// 	<collection name="gwasResults" referenced-type="GWASResult" reverse-reference="markers"/>
// 	<collection name="linkageGroupPositions" referenced-type="LinkageGroupPosition"/>
// </class>
const intermineGeneticMarkerAttributes = [
    'GeneticMarker.id',
    'GeneticMarker.primaryIdentifier',
    'GeneticMarker.description',
    'GeneticMarker.symbol',
    'GeneticMarker.name',
    'GeneticMarker.assemblyVersion',
    'GeneticMarker.annotationVersion',
    'GeneticMarker.organism.taxonId',
    'GeneticMarker.strain.identifier',
    'GeneticMarker.length',
    'GeneticMarker.genotypingPlatform',
    'GeneticMarker.motif',
    'GeneticMarker.alias',
    'GeneticMarker.alleles',
];
const intermineGeneticMarkerSort = 'GeneticMarker.primaryIdentifier';

// type GeneticMarker implements SequenceFeature {
//   id: ID!
//   identifier: String!
//   # ontologyAnnotations
//   # publications
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
//   genotypingPlatform: String
//   motif: String
//   alias: String
//   type: String
//   alleles: String
//   qtls: [QTL]
//   gwasResults: [GWASResult]
//   linkageGroupPositions: [LinkageGroupPosition]
// }
const graphqlGeneticMarkerAttributes = [
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
    'genotypingPlatform',
    'motif',
    'alias',
    'type',
    'alleles',
];

function response2geneticMarkers(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlGeneticMarkerAttributes);
}

module.exports = {
    intermineGeneticMarkerAttributes,
    intermineGeneticMarkerSort,
    graphqlGeneticMarkerAttributes,
    response2geneticMarkers,
};
