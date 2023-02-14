import { Response, response2graphqlObjects } from '../intermine.server.js';


// <class name="Strain" is-interface="true" term="http://semanticscience.org/resource/SIO_010055">
// 	<attribute name="identifier" type="java.lang.String" term="http://edamontology.org/data_2379"/>
// 	<attribute name="name" type="java.lang.String" term="http://edamontology.org/data_1046"/>
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="origin" type="java.lang.String"/>
//	<attribute name="accession" type="java.lang.String" term="http://edamontology.org/data_2912"/>
// 	<reference name="organism" referenced-type="Organism" reverse-reference="strains" term="http://purl.org/net/orth#organism"/>
//      <collection name="dataSets" referenced-type="DataSet"/>
// </class>
export const intermineStrainAttributes = [
    'Strain.id',
    'Strain.identifier',
    'Strain.name',
    'Strain.description',
    'Strain.origin',
    'Strain.accession',
    'Strain.organism.id', // internal resolution of organism
];
export const intermineStrainSort = 'Strain.identifier'; // guaranteed not null
export type IntermineStrain = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
];


// type Strain {
//   id: ID!
//   identifier: String!
//   name: String
//   description: String
//   origin: String
//   accession: String
//   organism: Organism
// }
export const graphqlStrainAttributes = [
    'id',
    'identifier',
    'name',
    'description',
    'origin',
    'accession',
    'organismId',    // internal resolution of organism
];
export type GraphQLStrain = {
  [prop in typeof graphqlStrainAttributes[number]]: string;
}


export type IntermineStrainResponse = Response<IntermineStrain>;
export function response2strains(response: IntermineStrainResponse): Array<GraphQLStrain> {
    return response2graphqlObjects(response, graphqlStrainAttributes);
}
