import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLLinkageGroup,
    IntermineLinkageGroupResponse,
    intermineLinkageGroupAttributes,
    intermineLinkageGroupSort,
    response2linkageGroups,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get LinkageGroups for a GeneticMap
export async function getLinkageGroupsForGeneticMap(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLLinkageGroup>> {
    const constraints = [intermineConstraint('LinkageGroup.geneticMap.id', '=', id)];
    const query = interminePathQuery(
        intermineLinkageGroupAttributes,
        intermineLinkageGroupSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
      .then((response: IntermineLinkageGroupResponse) => response2linkageGroups(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
