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
];
export const intermineOrganismSort = 'Organism.genus'; // guaranteed not null

export type IntermineOrganism = [
  number, // id
  string, // taxonId
  string, // abbreviation
  string, // name
  string, // commonName
  string, // description
  string, // genus
  string, // species
];

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

// Organism.dataSets does not have a reverse reference
export const intermineOrganismDataSetAttributes = [
    'Organism.dataSets.id',
    'Organism.dataSets.description',
    'Organism.dataSets.licence',
    'Organism.dataSets.url',
    'Organism.dataSets.name',
    'Organism.dataSets.version',
    'Organism.dataSets.synopsis',
    'Organism.dataSets.dataSource.name',  // resolve reference
    'Organism.dataSets.publication.doi',  // resolve reference
];
export const intermineOrganismDataSetSort = 'Organism.dataSets.name';
// use IntermineDataSet

