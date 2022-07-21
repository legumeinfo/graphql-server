// This file contains Intermine models and their corresponding GraphQL models,
// and helper functions to convert between them.
const { response2graphqlObjects } = require('./intermine.pathquery.js');


// the attributes of an Organism in InterMine
const intermineOrganismAttributes = [
  'Organism.id',
  'Organism.name',
  'Organism.commonName',
  'Organism.description',
  'Organism.genus',
  'Organism.species',
];


// the attributes of an Organism in the GraphQL API
const graphqlOrganismAttributes = [
  'id',
  'name',
  'commonName',
  'description',
  'genus',
  'species',
];


// converts an Intermine response into an array of GraphQL Organism objects
function response2organisms(response) {
  return response2graphqlObjects(response, graphqlOrganismAttributes);
}


// the attributes of an Strain in InterMine
const intermineStrainAttributes = [
  'Strain.id',
  'Strain.name',
  'Strain.accession',
];


// the attributes of an Strain in the GraphQL API
const graphqlStrainAttributes = [
  'id',
  'name',
  'accession',
];


// converts an Intermine response into an array of GraphQL Strain objects
function response2strains(response) {
  return response2graphqlObjects(response, graphqlStrainAttributes);
}


// the attributes of a Gene in InterMine
// Note: collections like proteinDomains may be empty, in which case the query returns
// null if they are in the query. Only attributes, not references or collections, can
// be guaranteed to exist and result in a non-null response (unless there is an ironclad
// guarantee that references or collections are populated, which is unlikely).
const intermineGeneAttributes = [
  'Gene.id',
  'Gene.name',
  'Gene.description',
  'Gene.strain.id',
  'Gene.assemblyVersion',
  //'Gene.geneFamily.id',
  //'Gene.proteinDomains.name',
  //'Gene.proteinDomains.accession',
];


// the attributes of a Gene in the GraphQL API
const graphqlGeneAttributes = [
  'id',
  'name',
  'description',
  'strainId',
  'genome',
  'proteinDomains',
];


// converts an Intermine response into an array of GraphQL Gene objects
function response2genes(response) {
  return response2graphqlObjects(response, graphqlGeneAttributes);
}


// the attributes of a ProteinDomain in InterMine
const intermineProteinDomainAttributes = [
  'ProteinDomain.id',
  'ProteinDomain.identifier',
  'ProteinDomain.name',
  'ProteinDomain.description',
];


// the attributes of a ProteinDomain in the GraphQL API
const graphqlProteinDomainAttributes = [
  'id',
  'accession',
  'name',
  'description',
];


// converts an Intermine response into an array of GraphQL ProteinDomain objects
function response2proteindomains(response) {
  return response2graphqlObjects(response, graphqlProteinDomainAttributes);
}


// the attributes of a Gene Family in InterMine
const intermineGeneFamilyAttributes = [
  'GeneFamily.id',
  'GeneFamily.identifier',
  'GeneFamily.description',
];


// the attributes of a Gene Family in the GraphQL API
const graphqlGeneFamilyAttributes = [
  'id',
  'name',
  'description',
];


// converts an Intermine response into an array of GraphQL Gene Family objects
function response2geneFamilies(response) {
  return response2graphqlObjects(response, graphqlGeneFamilyAttributes);
}


module.exports = {
  // organism
  intermineOrganismAttributes,
  graphqlOrganismAttributes,
  response2organisms,
  // strain
  intermineStrainAttributes,
  graphqlStrainAttributes,
  response2strains,
  // gene
  intermineGeneAttributes,
  graphqlGeneAttributes,
  response2genes,
  // domain
  intermineProteinDomainAttributes,
  graphqlProteinDomainAttributes,
  response2proteindomains,
  // family
  intermineGeneFamilyAttributes,
  graphqlGeneFamilyAttributes,
  response2geneFamilies,
};
