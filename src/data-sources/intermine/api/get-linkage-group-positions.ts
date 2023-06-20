import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLGeneticMarker,
  GraphQLLinkageGroupPosition,
  IntermineLinkageGroupPositionResponse,
  intermineGeneticMarkerLinkageGroupPositionsAttributes,
  intermineGeneticMarkerLinkageGroupPositionsSort,
  response2linkageGroupPositions,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


// get LinkageGroupPositions for a GeneticMarker
export async function getLinkageGroupPositions(
    geneticMarker: GraphQLGeneticMarker,
    {start, size}: PaginationOptions,
): Promise<ApiResponse<GraphQLLinkageGroupPosition[]>> {
    // no reverse reference in LinkageGroupPosition so query GeneticMarker
    const constraints = [intermineConstraint('GeneticMarker.id', '=', geneticMarker.id)];
    const query = interminePathQuery(
        intermineGeneticMarkerLinkageGroupPositionsAttributes,
        intermineGeneticMarkerLinkageGroupPositionsSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
      .then((response: IntermineLinkageGroupPositionResponse) => response2linkageGroupPositions(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GeneticMarker.linkageGroupPositions.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
