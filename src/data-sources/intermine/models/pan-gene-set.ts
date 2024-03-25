import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';


// <class name="PanGeneSet" extends="Annotatable" is-interface="true" term="">
// 	<collection name="transcripts" referenced-type="Transcript" reverse-reference="panGeneSets"/>
// 	<collection name="genes" referenced-type="Gene" reverse-reference="panGeneSets"/>
// 	<collection name="proteins" referenced-type="Protein" reverse-reference="panGeneSets"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const interminePanGeneSetAttributes = [
    'PanGeneSet.id',
    'PanGeneSet.primaryIdentifier',
];
export const interminePanGeneSetSort = 'PanGeneSet.primaryIdentifier';
export type InterminePanGeneSet = [
  number,
  string,
];


// type PanGeneSet implements Annotatable {
//   id: ID!
//   identifier: String!
//   # ontologyAnnotations
//   # publications
//   genes: [Gene]
//   proteins: [Protein]
//   transcripts: [Transcript]
//   # dataSets [DataSet]
// }
export const graphqlPanGeneSetAttributes = [
    'id',
    'identifier',
];
export type GraphQLPanGeneSet = {
  [prop in typeof graphqlPanGeneSetAttributes[number]]: string;
}


export type InterminePanGeneSetResponse = IntermineDataResponse<InterminePanGeneSet>;
export function response2panGeneSets(response: InterminePanGeneSetResponse): Array<GraphQLPanGeneSet> {
    return response2graphqlObjects(response, graphqlPanGeneSetAttributes);
}

// PanGeneSet.dataSets has no reverse reference
export const interminePanGeneSetDataSetAttributes = [
    'PanGeneSet.dataSets.id',
    'PanGeneSet.dataSets.description',
    'PanGeneSet.dataSets.licence',
    'PanGeneSet.dataSets.url',
    'PanGeneSet.dataSets.name',
    'PanGeneSet.dataSets.version',
    'PanGeneSet.dataSets.synopsis',
];
export const interminePanGeneSetDataSetSort = 'PanGeneSet.dataSets.name'; // guaranteed not null
export type InterminePanGeneSetDataSet = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
];
