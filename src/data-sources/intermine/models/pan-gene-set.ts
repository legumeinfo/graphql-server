import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
import {
  IntermineAnnotatable,
  graphqlAnnotatableAttributes,
  intermineAnnotatableAttributesFactory,
} from './annotatable.js';


// <class name="PanGeneSet" extends="Annotatable" is-interface="true" term="">
// 	<collection name="transcripts" referenced-type="Transcript" reverse-reference="panGeneSets"/>
// 	<collection name="genes" referenced-type="Gene" reverse-reference="panGeneSets"/>
// 	<collection name="proteins" referenced-type="Protein" reverse-reference="panGeneSets"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const interminePanGeneSetAttributes = [
    ...intermineAnnotatableAttributesFactory('PanGeneSet'),
];
export const interminePanGeneSetSort = 'PanGeneSet.primaryIdentifier';
export type InterminePanGeneSet = [
    ...IntermineAnnotatable,
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
    ...graphqlAnnotatableAttributes,
];
export type GraphQLPanGeneSet = {
  [prop in typeof graphqlPanGeneSetAttributes[number]]: string;
}


export type InterminePanGeneSetResponse = IntermineDataResponse<InterminePanGeneSet>;
export function response2panGeneSets(response: InterminePanGeneSetResponse): Array<GraphQLPanGeneSet> {
    return response2graphqlObjects(response, graphqlPanGeneSetAttributes);
}
