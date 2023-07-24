import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';
// <class name="Newick" extends="java.lang.Object" is-interface="false" term="">
//     <attribute name="contents" type="java.lang.String"/>
//     <attribute name="identifier" type="java.lang.String"/>
//     <reference name="phylotree" referenced-type="Phylotree"/>
//     <reference name="geneFamily" referenced-type="GeneFamily"/>
// </class>
export const intermineNewickAttributes = [
    'Newick.identifier',
    'Newick.contents',
    'Newick.phylotree.primaryIdentifier',
    'Newick.geneFamily.primaryIdentifier',
];
export const intermineNewickSort = 'Newick.identifier'; // guaranteed not null
export type IntermineNewick = [
  string,
  string,
  number,
  number,
];

// type Newick {
//   identifier: ID!
//   contents: String!
//   phylotree: Phylotree,
//   geneFamily: GeneFamily,
// }
export const graphqlNewickAttributes = [
    'identifier',
    'contents',
    'phylotreeIdentifier',
    'geneFamilyIdentifier',
];
export type GraphQLNewick = {
  [prop in typeof graphqlNewickAttributes[number]]: string;
}


export type IntermineNewickResponse = IntermineDataResponse<IntermineNewick>;
export function response2newicks(response: IntermineNewickResponse): Array<GraphQLNewick> {
    return response2graphqlObjects(response, graphqlNewickAttributes);
}
