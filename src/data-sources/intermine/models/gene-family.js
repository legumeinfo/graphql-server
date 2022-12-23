// <class name="GeneFamily" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="version" type="java.lang.String"/>
// 	<attribute name="size" type="java.lang.Integer"/>
// 	<reference name="phylotree" referenced-type="Phylotree" reverse-reference="geneFamily"/>
// 	<collection name="genes" referenced-type="Gene"/>
// 	<collection name="proteins" referenced-type="Protein"/>
// 	<collection name="proteinDomains" referenced-type="ProteinDomain" reverse-reference="geneFamilies"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// 	<collection name="tallies" referenced-type="GeneFamilyTally" reverse-reference="geneFamily"/>
// </class>
const intermineGeneFamilyAttributes = [
    'GeneFamily.id',
    'GeneFamily.primaryIdentifier',
    'GeneFamily.description',
    'GeneFamily.version',
    'GeneFamily.size',
    'GeneFamily.phylotree.id', // internal resolution of Phylotree
];
const intermineGeneFamilySort = 'GeneFamily.primaryIdentifier';
// type GeneFamily implements Annotatable {
//   id: ID!
//   identifier: String!
//   # ontologyAnnotations
//   # publications
//   description: String
//   version: String
//   size: Int
//   phylotree: Phylotree
//   genes: [Gene]
//   # proteins: [Protein]
//   proteinDomains: [ProteinDomain]
//   # tallies: [GeneFamilyTally]
// }
const graphqlGeneFamilyAttributes = [
    'id',
    'identifier',
    'description',
    'version',
    'size',
    'phylotreeId', // internal resolution of Phylotree
];
function response2geneFamilies(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlGeneFamilyAttributes);
}

module.exports = {
    intermineGeneFamilyAttributes,
    intermineGeneFamilySort,
    graphqlGeneFamilyAttributes,
    response2geneFamilies,
};
