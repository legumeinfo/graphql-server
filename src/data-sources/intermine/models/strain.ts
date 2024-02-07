import { IntermineDataResponse, response2graphqlObjects } from '../intermine.server.js';

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
    'Strain.organism.taxonId', // resolve reference
];
export const intermineStrainSort = 'Strain.identifier'; // guaranteed not null

export type IntermineStrain = [
  number, // id
  string, // identifier
  string, // name
  string, // description
  string, // origin
  string, // accession
  number, // organism.taxonId
];

export const graphqlStrainAttributes = [
    'id',
    'identifier',
    'name',
    'description',
    'origin',
    'accession',
    'organismTaxonId', // resolve Organism
];

export type GraphQLStrain = {
  [prop in typeof graphqlStrainAttributes[number]]: string;
}

export type IntermineStrainResponse = IntermineDataResponse<IntermineStrain>;

export function response2strains(response: IntermineStrainResponse): Array<GraphQLStrain> {
    return response2graphqlObjects(response, graphqlStrainAttributes);
}

// Strain.dataSets does not have a reverse reference
export const intermineStrainDataSetAttributes = [
    'Strain.dataSets.id',
    'Strain.dataSets.description',
    'Strain.dataSets.licence',
    'Strain.dataSets.url',
    'Strain.dataSets.name',
    'Strain.dataSets.version',
    'Strain.dataSets.synopsis',
    'Strain.dataSets.dataSource.name',  // resolve reference
    'Strain.dataSets.publication.doi',  // resolve reference
];
export const intermineStrainDataSetSort = 'Strain.dataSets.name';
// use IntermineDataSet

