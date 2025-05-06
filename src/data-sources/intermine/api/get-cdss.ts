import {
  ApiResponse,
  IntermineCountResponse,
  intermineConstraint,
  interminePathQuery,
  countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLCDS,
  IntermineCDSResponse,
  intermineCDSAttributes,
  intermineCDSSort,
  response2cdss,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';
import {sequenceFeatureJoinFactory} from './sequence-feature.js';

// Get CDSs associated with a Transcript
export async function getCDSsForTranscript(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLCDS>> {
  const constraints = [intermineConstraint('CDS.transcript.id', '=', id)];
  const joins = sequenceFeatureJoinFactory('CDS');
  const query = interminePathQuery(
    intermineCDSAttributes,
    intermineCDSSort,
    constraints,
    joins,
  );
  // get the data
  const dataPromise = this.pathQuery(query, {page, pageSize}).then(
    (response: IntermineCDSResponse) => response2cdss(response),
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
