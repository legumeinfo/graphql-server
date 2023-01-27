// <class name="LinkageGroup" is-interface="true" term="http://purl.obolibrary.org/obo/SO:0000018">
// 	<attribute name="identifier" type="java.lang.String"/>
// 	<attribute name="length" type="java.lang.Double"/>
// 	<attribute name="number" type="java.lang.Integer"/>
// 	<reference name="geneticMap" referenced-type="GeneticMap" reverse-reference="linkageGroups"/>
// 	<collection name="qtls" referenced-type="QTL" reverse-reference="linkageGroup"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>

const intermineLinkageGroupAttributes = [
    'LinkageGroup.id',
    'LinkageGroup.identifier',
    'LinkageGroup.length',
    'LinkageGroup.number',
    'LinkageGroup.geneticMap.id',
];
const intermineLinkageGroupSort = 'LinkageGroup.identifier';

// type LinkageGroup {
//   id: ID!
//   identifier: String!
//   length: Float
//   number: Int
//   geneticMap: GeneticMap
//   qtls: [QTL]
//   # dataSets
// }
const graphqlLinkageGroupAttributes = [
    'id',
    'identifier',
    'length',
    'number',
    'geneticMapId',
];

function response2linkageGroups(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlLinkageGroupAttributes);
}

// LinkageGroup.dataSets has no reverse reference
const intermineLinkageGroupDataSetAttributes = [
    'LinkageGroup.dataSets.id',
    'LinkageGroup.dataSets.description',
    'LinkageGroup.dataSets.licence',
    'LinkageGroup.dataSets.url',
    'LinkageGroup.dataSets.name',
    'LinkageGroup.dataSets.version',
    'LinkageGroup.dataSets.synopsis',
    'LinkageGroup.dataSets.publication.id',  // internal resolution of publication
];
const intermineLinkageGroupDataSetSort = 'LinkageGroup.dataSets.name'; // guaranteed not null

module.exports = {
    intermineLinkageGroupAttributes,
    intermineLinkageGroupSort,
    graphqlLinkageGroupAttributes,
    response2linkageGroups,

    intermineLinkageGroupDataSetAttributes,
    intermineLinkageGroupDataSetSort,
};
