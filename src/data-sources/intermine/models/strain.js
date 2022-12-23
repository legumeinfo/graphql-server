// <class name="Strain" is-interface="true" term="http://semanticscience.org/resource/SIO_010055">
// 	<attribute name="identifier" type="java.lang.String" term="http://edamontology.org/data_2379"/>
// 	<attribute name="name" type="java.lang.String" term="http://edamontology.org/data_1046"/>
// 	<attribute name="description" type="java.lang.String"/>
// 	<attribute name="origin" type="java.lang.String"/>
//	<attribute name="accession" type="java.lang.String" term="http://edamontology.org/data_2912"/>
// 	<reference name="organism" referenced-type="Organism" reverse-reference="strains" term="http://purl.org/net/orth#organism"/>
//      <collection name="dataSets" referenced-type="DataSet"/>
// </class>
const intermineStrainAttributes = [
    'Strain.id',
    'Strain.identifier',
    'Strain.name',
    'Strain.description',
    'Strain.origin',
    'Strain.accession',
    'Strain.organism.id', // internal resolution of organism
];
const intermineStrainSort = 'Strain.identifier'; // guaranteed not null
// type Strain {
//   id: ID!
//   identifier: String!
//   name: String
//   description: String
//   origin: String
//   accession: String
//   organism: Organism
// }
const graphqlStrainAttributes = [
    'id',
    'identifier',
    'name',
    'description',
    'origin',
    'accession',
    'organismId',    // internal resolution of organism
];
function response2strains(response) {
    return this.pathquery.response2graphqlObjects(response, graphqlStrainAttributes);
}


module.exports = {
    intermineStrainAttributes,
    intermineStrainSort,
    graphqlStrainAttributes,
    response2strains,
};
