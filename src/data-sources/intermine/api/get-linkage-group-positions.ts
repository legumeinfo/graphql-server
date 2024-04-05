import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLLinkageGroupPosition,
  IntermineLinkageGroupPositionResponse,
  intermineGeneticMarkerLinkageGroupPositionsAttributes,
  intermineGeneticMarkerLinkageGroupPositionsSort,
  response2linkageGroupPositions,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get LinkageGroupPositions for a GeneticMarker
export async function getLinkageGroupPositionsForGeneticMarker(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLLinkageGroupPosition>> {
    // no reverse reference in LinkageGroupPosition so query GeneticMarker
    const constraints = [intermineConstraint('GeneticMarker.id', '=', id)];
    const query = interminePathQuery(
        intermineGeneticMarkerLinkageGroupPositionsAttributes,
        intermineGeneticMarkerLinkageGroupPositionsSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineLinkageGroupPositionResponse) => response2linkageGroupPositions(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GeneticMarker.linkageGroupPositions.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
