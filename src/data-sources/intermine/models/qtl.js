// <class name="QTL" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0001645">
// 	<attribute name="identifier" type="java.lang.String"/>
// 	<attribute name="lod" type="java.lang.Double"/>
// 	<attribute name="likelihoodRatio" type="java.lang.Double"/>
// 	<attribute name="end" type="java.lang.Double"/>
// 	<attribute name="markerNames" type="java.lang.String"/>
// 	<attribute name="markerR2" type="java.lang.Double"/>
// 	<attribute name="start" type="java.lang.Double"/>
// 	<attribute name="peak" type="java.lang.Double"/>
// 	<reference name="trait" referenced-type="Trait" reverse-reference="qtls"/>
// 	<reference name="qtlStudy" referenced-type="QTLStudy" reverse-reference="qtls"/>
// 	<reference name="linkageGroup" referenced-type="LinkageGroup" reverse-reference="qtls"/>
// 	<reference name="dataSet" referenced-type="DataSet"/>
// 	<collection name="genes" referenced-type="Gene"/>
// 	<collection name="markers" referenced-type="GeneticMarker" reverse-reference="qtls"/>
// </class>
const intermineQTLAttributes = [
    'QTL.id',
    'QTL.identifier',
    'QTL.end',
    'QTL.markerNames',
    'QTL.start',
    'QTL.trait.id',
    'QTL.qtlStudy.id',
    'QTL.linkageGroup.id',
];
const intermineQTLSort = 'QTL.trait.name ASC QTL.identifier ASC';

// type QTL {
//   id: ID!
//   identifier: String!
//   # lod: Float
//   # likelihoodRatio: Float
//   end: Float
//   markerNames: String
//   # markerR2
//   start: Float
//   # peak
//   trait: Trait
//   qtlStudy: QTLStudy
//   linkageGroup
//   # dataSet: DataSet
//   # genes: [Gene]
//   # markers: [GeneticMarker]
// }
const graphqlQTLAttributes = [
    'id',
    'identifier',
    'end',
    'markerNames',
    'start',
    'traitId',
    'qtlStudyId',
    'linkageGroupId',
];

function response2qtls(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlQTLAttributes);
}


module.exports = {
    intermineQTLAttributes,
    intermineQTLSort,
    graphqlQTLAttributes,
    response2qtls,
};
