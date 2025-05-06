import {
  ApiResponse,
  IntermineCountResponse,
  countResponse2graphqlPageInfo,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLGeneFlankingRegion,
  IntermineGeneFlankingRegionResponse,
  intermineGeneFlankingRegionAttributes,
  intermineGeneFlankingRegionSort,
  response2geneFlankingRegions,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';
import {sequenceFeatureJoinFactory} from './sequence-feature.js';

// Get GeneFlankingRegions associated with a Gene
export async function getGeneFlankingRegionsForGene(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGeneFlankingRegion>> {
  const constraints = [
    intermineConstraint('GeneFlankingRegion.gene.id', '=', id),
  ];
  const joins = sequenceFeatureJoinFactory('GeneFlankingRegion');
  const query = interminePathQuery(
    intermineGeneFlankingRegionAttributes,
    intermineGeneFlankingRegionSort,
    constraints,
    joins,
  );
  // get the data
  const dataPromise = this.pathQuery(query, {page, pageSize}).then(
    (response: IntermineGeneFlankingRegionResponse) =>
      response2geneFlankingRegions(response),
  );
  // get a summary of the data and convert it to page info
  const pageInfoPromise = this.pathQueryCount(query).then(
    (response: IntermineCountResponse) =>
      countResponse2graphqlPageInfo(response, page, pageSize),
  );
  // return the expected GraphQL type
  return Promise.all([dataPromise, pageInfoPromise]).then(
    ([data, pageInfo]) => ({data, metadata: {pageInfo}}),
  );
}
