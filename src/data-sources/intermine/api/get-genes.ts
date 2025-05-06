import {
  ApiResponse,
  IntermineCountResponse,
  countResponse2graphqlPageInfo,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLGene,
  IntermineGeneResponse,
  intermineGeneAttributes,
  intermineGeneSort,
  intermineIntergenicRegionAdjacentGeneAttributes,
  intermineIntergenicRegionAdjacentGeneSort,
  intermineIntronGeneAttributes,
  intermineIntronGeneSort,
  intermineQTLGenesAttributes,
  intermineQTLGenesSort,
  response2genes,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';
import {sequenceFeatureJoinFactory} from './sequence-feature.js';

// get Genes using the given query and returns the expected GraphQL types
async function getGenes(
  pathQuery: string,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGene>> {
  // get the data
  const dataPromise = this.pathQuery(pathQuery, {page, pageSize}).then(
    (response: IntermineGeneResponse) => response2genes(response),
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

// get Genes associated with a GeneFamily
export async function getGenesForGeneFamily(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGene>> {
  const constraints = [
    intermineConstraint('Gene.geneFamilyAssignments.geneFamily.id', '=', id),
  ];
  const joins = sequenceFeatureJoinFactory('Gene');
  const query = interminePathQuery(
    intermineGeneAttributes,
    intermineGeneSort,
    constraints,
    joins,
  );
  return getGenes.call(this, query, {page, pageSize});
}

// get Genes associated with a PanGeneSet
export async function getGenesForPanGeneSet(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGene>> {
  const constraints = [intermineConstraint('Gene.panGeneSets.id', '=', id)];
  const joins = sequenceFeatureJoinFactory('Gene');
  const query = interminePathQuery(
    intermineGeneAttributes,
    intermineGeneSort,
    constraints,
    joins,
  );
  return getGenes.call(this, query, {page, pageSize});
}

// get Genes associated with a Pathway
export async function getGenesForPathway(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGene>> {
  const constraints = [intermineConstraint('Gene.pathways.id', '=', id)];
  const joins = sequenceFeatureJoinFactory('Gene');
  const query = interminePathQuery(
    intermineGeneAttributes,
    intermineGeneSort,
    constraints,
    joins,
  );
  return getGenes.call(this, query, {page, pageSize});
}

// get Genes associated with a Protein
export async function getGenesForProtein(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGene>> {
  const constraints = [intermineConstraint('Gene.proteins.id', '=', id)];
  const joins = sequenceFeatureJoinFactory('Gene');
  const query = interminePathQuery(
    intermineGeneAttributes,
    intermineGeneSort,
    constraints,
    joins,
  );
  return getGenes.call(this, query, {page, pageSize});
}

// get Genes associated with a ProteinDomain
export async function getGenesForProteinDomain(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGene>> {
  const constraints = [intermineConstraint('Gene.proteinDomains.id', '=', id)];
  const joins = sequenceFeatureJoinFactory('Gene');
  const query = interminePathQuery(
    intermineGeneAttributes,
    intermineGeneSort,
    constraints,
    joins,
  );
  return getGenes.call(this, query, {page, pageSize});
}

// get adjacent Genes for an IntergenicRegion by id
export async function getAdjacentGenesForIntergenicRegion(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGene>> {
  const constraints = [intermineConstraint('IntergenicRegion.id', '=', id)];
  const joins = sequenceFeatureJoinFactory('IntergenicRegion.adjacentGenes');
  const query = interminePathQuery(
    intermineIntergenicRegionAdjacentGeneAttributes,
    intermineIntergenicRegionAdjacentGeneSort,
    constraints,
    joins,
  );
  return getGenes.call(this, query, {page, pageSize});
}

// get Genes for an Intron by id
export async function getGenesForIntron(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGene>> {
  const constraints = [intermineConstraint('Intron.id', '=', id)];
  const joins = sequenceFeatureJoinFactory('Intron.genes');
  const query = interminePathQuery(
    intermineIntronGeneAttributes,
    intermineIntronGeneSort,
    constraints,
    joins,
  );
  return getGenes.call(this, query, {page, pageSize});
}

// get Genes associated with a QTL, for which there is no reverse reference from Gene
export async function getGenesForQTL(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGene>> {
  const constraints = [intermineConstraint('QTL.id', '=', id)];
  const joins = sequenceFeatureJoinFactory('QTL.genes');
  const query = interminePathQuery(
    intermineQTLGenesAttributes,
    intermineQTLGenesSort,
    constraints,
    joins,
  );
  return getGenes.call(this, query, {page, pageSize});
}
