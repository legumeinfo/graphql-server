import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

// <class name="PanGeneSet" extends="Annotatable" is-interface="true" term="">
// 	<collection name="transcripts" referenced-type="Transcript" reverse-reference="panGeneSets"/>
// 	<collection name="genes" referenced-type="Gene" reverse-reference="panGeneSets"/>
// 	<collection name="proteins" referenced-type="Protein" reverse-reference="panGeneSets"/>
// </class>
export const interminePanGeneSetAttributes = [
    'PanGeneSet.id',                 // Annotatable
    'PanGeneSet.primaryIdentifier',  // Annotatable
];
export const interminePanGeneSetSort = 'PanGeneSet.primaryIdentifier';

export type InterminePanGeneSet = [
  number, // id
  string, // primaryIdentifier
];

export const graphqlPanGeneSetAttributes = [
    'id',           // id
    'identifier',   // primaryIdentifier
];

export type GraphQLPanGeneSet = {
  [prop in typeof graphqlPanGeneSetAttributes[number]]: string;
}

export type InterminePanGeneSetResponse = IntermineDataResponse<InterminePanGeneSet>;

export function response2panGeneSets(response: InterminePanGeneSetResponse): Array<GraphQLPanGeneSet> {
    return response2graphqlObjects(response, graphqlPanGeneSetAttributes);
}
