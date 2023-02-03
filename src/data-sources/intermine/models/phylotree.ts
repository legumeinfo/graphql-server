// Phylotree InterMine path query attributes
// <class name="Phylotree" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="numLeaves" type="java.lang.Integer"/>
// 	<reference name="geneFamily" referenced-type="GeneFamily" reverse-reference="phylotree"/>
// 	<collection name="nodes" referenced-type="Phylonode" reverse-reference="tree"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const interminePhylotreeAttributes = [
    'Phylotree.id',
    'Phylotree.primaryIdentifier',
    'Phylotree.numLeaves',
    'Phylotree.geneFamily.id',
];
export const interminePhylotreeSort = 'Phylotree.primaryIdentifier';


export const graphqlPhylotreeAttributes = [
    'id',
    'identifier',
    'numLeaves',
    'geneFamilyId',
];


export function response2phylotrees(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlPhylotreeAttributes);
}


// Phylotree.dataSets has no reverse reference
export const interminePhylotreeDataSetAttributes = [
    'Phylotree.dataSets.id',
    'Phylotree.dataSets.description',
    'Phylotree.dataSets.licence',
    'Phylotree.dataSets.url',
    'Phylotree.dataSets.name',
    'Phylotree.dataSets.version',
    'Phylotree.dataSets.synopsis',
    'Phylotree.dataSets.publication.id',  // internal resolution of publication
];
export const interminePhylotreeDataSetSort = 'Phylotree.dataSets.name'; // guaranteed not null
