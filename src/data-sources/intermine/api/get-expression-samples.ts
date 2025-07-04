import {
  ApiResponse,
  IntermineCountResponse,
  intermineConstraint,
  interminePathQuery,
  countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLExpressionSample,
  IntermineExpressionSampleResponse,
  intermineExpressionSampleAttributes,
  intermineExpressionSampleSort,
  response2expressionSamples,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';

// get ExpressionSamples for an ExpressionSource
export async function getExpressionSamplesForExpressionSource(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLExpressionSample>> {
  const constraints = [
    intermineConstraint('ExpressionSample.source.id', '=', id),
  ];
  const query = interminePathQuery(
    intermineExpressionSampleAttributes,
    intermineExpressionSampleSort,
    constraints,
  );
  // get the data
  const dataPromise = this.pathQuery(query, {page, pageSize}).then(
    (response: IntermineExpressionSampleResponse) =>
      response2expressionSamples(response),
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
