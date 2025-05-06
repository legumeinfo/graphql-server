import {
  ApiResponse,
  IntermineCountResponse,
  countResponse2graphqlPageInfo,
  intermineConstraint,
  intermineJoin,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLDataSet,
  IntermineDataSetResponse,
  intermineDataSetAttributes,
  intermineDataSetSort,
  intermineLocationDataSetAttributes,
  intermineLocationDataSetSort,
  intermineOntologyDataSetAttributes,
  intermineOntologyDataSetSort,
  intermineOntologyAnnotationDataSetAttributes,
  intermineOntologyAnnotationDataSetSort,
  intermineOntologyTermDataSetAttributes,
  intermineOntologyTermDataSetSort,
  intermineOrganismDataSetAttributes,
  intermineOrganismDataSetSort,
  intermineStrainDataSetAttributes,
  intermineStrainDataSetSort,
  response2dataSets,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';

// get DataSets using the given query and returns the expected GraphQL types
async function getDataSets(
  pathQuery: string,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
  // get the data
  const dataPromise = this.pathQuery(pathQuery, {page, pageSize}).then(
    (response: IntermineDataSetResponse) => response2dataSets(response),
  );
  // get a summary of the data and convert it to page info
  const pageInfoPromise = this.pathQueryCount(pathQuery).then(
    (response: IntermineCountResponse) =>
      countResponse2graphqlPageInfo(response, page, pageSize),
  );
  // return the expected GraphQL type
  return Promise.all([dataPromise, pageInfoPromise]).then(
    ([data, pageInfo]) => ({data, metadata: {pageInfo}}),
  );
}

// get DataSets for an Annotatable by id
export async function getDataSetsForAnnotatable(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
  const constraints = [intermineConstraint('DataSet.entities.id', '=', id)];
  // publication may be null
  const joins = [intermineJoin('DataSet.publication', 'OUTER')];
  const query = interminePathQuery(
    intermineDataSetAttributes,
    intermineDataSetSort,
    constraints,
    joins,
  );
  // get the data
  return getDataSets.call(this, query, {page, pageSize});
}

// get DataSets for a DataSource by id
export async function getDataSetsForDataSource(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
  const constraints = [intermineConstraint('DataSet.dataSource.id', '=', id)];
  // publication may be null
  const joins = [intermineJoin('DataSet.publication', 'OUTER')];
  const query = interminePathQuery(
    intermineDataSetAttributes,
    intermineDataSetSort,
    constraints,
    joins,
  );
  // get the data
  return getDataSets.call(this, query, {page, pageSize});
}

// get DataSets for a Location by id; Location.dataSets has no reverse reference
export async function getDataSetsForLocation(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
  const constraints = [intermineConstraint('Location.id', '=', id)];
  // publication may be null
  const joins = [intermineJoin('Location.dataSets.publication', 'OUTER')];
  const query = interminePathQuery(
    intermineLocationDataSetAttributes,
    intermineLocationDataSetSort,
    constraints,
    joins,
  );
  // get the data
  return getDataSets.call(this, query, {page, pageSize});
}

// get DataSets for an Ontology by id; Ontology.dataSets has no reverse reference from DataSet
export async function getDataSetsForOntology(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
  const constraints = [intermineConstraint('Ontology.id', '=', id)];
  // publication may be null
  const joins = [intermineJoin('Ontology.dataSets.publication', 'OUTER')];
  const query = interminePathQuery(
    intermineOntologyDataSetAttributes,
    intermineOntologyDataSetSort,
    constraints,
    joins,
  );
  // get the data
  return getDataSets.call(this, query, {page, pageSize});
}

// get DataSets for an OntologyAnnotation by id; OntologyAnnotation.dataSets has no reverse reference from DataSet
export async function getDataSetsForOntologyAnnotation(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
  const constraints = [intermineConstraint('OntologyAnnotation.id', '=', id)];
  // publication may be null
  const joins = [
    intermineJoin('OntologyAnnotation.dataSets.publication', 'OUTER'),
  ];
  const query = interminePathQuery(
    intermineOntologyAnnotationDataSetAttributes,
    intermineOntologyAnnotationDataSetSort,
    constraints,
    joins,
  );
  // get the data
  return getDataSets.call(this, query, {page, pageSize});
}

// get DataSets for an OntologyTerm by id; OntologyTerm.dataSets has no reverse reference from DataSet
export async function getDataSetsForOntologyTerm(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
  const constraints = [intermineConstraint('OntologyTerm.id', '=', id)];
  // publication may be null
  const joins = [intermineJoin('OntologyTerm.dataSets.publication', 'OUTER')];
  const query = interminePathQuery(
    intermineOntologyTermDataSetAttributes,
    intermineOntologyTermDataSetSort,
    constraints,
    joins,
  );
  // get the data
  return getDataSets.call(this, query, {page, pageSize});
}

// get DataSets for an Organism by id; Organism.dataSets has no reverse reference from DataSet
export async function getDataSetsForOrganism(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
  const constraints = [intermineConstraint('Organism.id', '=', id)];
  // publication may be null
  const joins = [intermineJoin('Organism.dataSets.publication', 'OUTER')];
  const query = interminePathQuery(
    intermineOrganismDataSetAttributes,
    intermineOrganismDataSetSort,
    constraints,
    joins,
  );
  // get the data
  return getDataSets.call(this, query, {page, pageSize});
}

// get DataSets for an Strain by id; Strain.dataSets has no reverse reference from DataSet
export async function getDataSetsForStrain(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
  const constraints = [intermineConstraint('Strain.id', '=', id)];
  // publication may be null
  const joins = [intermineJoin('Strain.dataSets.publication', 'OUTER')];
  const query = interminePathQuery(
    intermineStrainDataSetAttributes,
    intermineStrainDataSetSort,
    constraints,
    joins,
  );
  // get the data
  return getDataSets.call(this, query, {page, pageSize});
}
