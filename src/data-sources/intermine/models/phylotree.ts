import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';


// Phylotree InterMine path query attributes
// <class name="Phylotree" extends="Annotatable" is-interface="true" term="">
// 	<attribute name="numLeaves" type="java.lang.Integer"/>
// 	<reference name="geneFamily" referenced-type="GeneFamily" reverse-reference="phylotree"/>
// 	<collection name="nodes" referenced-type="Phylonode" reverse-reference="tree"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const interminePhylotreeAttributes = [
    ...intermineAnnotatableAttributesFactory('Phylotree'),
    'Phylotree.numLeaves',
    'Phylotree.geneFamily.primaryIdentifier',
];
export const interminePhylotreeSort = 'Phylotree.primaryIdentifier';
export type InterminePhylotree = [
  ...IntermineAnnotatable,
  number,
  string,
];


export const graphqlPhylotreeAttributes = [
    ...graphqlAnnotatableAttributes,
    'numLeaves',
    'geneFamilyIdentifier',
];
export type GraphQLPhylotree = {
  [prop in typeof graphqlPhylotreeAttributes[number]]: string;
}


export type InterminePhylotreeResponse = IntermineDataResponse<InterminePhylotree>;
export function response2phylotrees(response: InterminePhylotreeResponse): Array<GraphQLPhylotree> {
    return response2graphqlObjects(response, graphqlPhylotreeAttributes);
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
    'Phylotree.dataSets.publication.doi',  // internal resolution of publication
];
export const interminePhylotreeDataSetSort = 'Phylotree.dataSets.name'; // guaranteed not null
export type InterminePhylotreeDataSet = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];
