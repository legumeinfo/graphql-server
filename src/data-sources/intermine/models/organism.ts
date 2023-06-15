import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';


// <class name="Organism" is-interface="true" term="http://semanticscience.org/resource/SIO_010000">
// 	<attribute name="taxonId" type="java.lang.String" term="http://edamontology.org/data_1179"/>
// 	<attribute name="abbreviation" type="java.lang.String"/>
// 	<attribute name="name" type="java.lang.String" term="http://www.w3.org/2000/01/rdf-schema//label"/>
// 	<attribute name="commonName" type="java.lang.String" term="http://edamontology.org/data_2909"/>
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="genus" type="java.lang.String" term="http://edamontology.org/data_1870"/>
// 	<attribute name="species" type="java.lang.String" term="http://edamontology.org/data_1045"/>
// 	<attribute name="shortName" type="java.lang.String" term="http://edamontology.org/data_2909"/>
// 	<collection name="strains" referenced-type="Strain" reverse-reference="organism"/>
// 	<collection name="dataSets" referenced-type="DataSet"/>
// </class>    
export const intermineOrganismAttributes = [
    'Organism.id',
    'Organism.taxonId',
    'Organism.abbreviation',
    'Organism.name',
    'Organism.commonName',
    'Organism.description',
    'Organism.genus',
    'Organism.species',
    'Organism.shortName',
];
export const intermineOrganismSort = 'Organism.genus'; // guaranteed not null
export type IntermineOrganism = [
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];


// type Organism {
//   id: ID!
//   taxonId: Int!
//   abbreviation: String
//   name: String
//   commonName: String
//   description: String
//   genus: String
//   species: String
//   strains: [Strain!]
// }
export const graphqlOrganismAttributes = [
    'id',
    'taxonId',
    'abbreviation',
    'name',
    'commonName',
    'description',
    'genus',
    'species',
];
export type GraphQLOrganism = {
  [prop in typeof graphqlOrganismAttributes[number]]: string;
}


export type IntermineOrganismResponse = IntermineDataResponse<IntermineOrganism>;
export function response2organisms(response: IntermineOrganismResponse): Array<GraphQLOrganism> {
    return response2graphqlObjects(response, graphqlOrganismAttributes);
}
