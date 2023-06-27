import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLGeneticMap,
  GraphQLLinkageGroup,
  IntermineLinkageGroupResponse,
  intermineLinkageGroupAttributes,
  intermineLinkageGroupSort,
  response2linkageGroups,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetLinkageGroupsOptions = {
  geneticMap?: GraphQLGeneticMap;
} & PaginationOptions;


// get LinkageGroups for a GeneticMap
export async function getLinkageGroups(
    {geneticMap, page, pageSize}: GetLinkageGroupsOptions,
): Promise<ApiResponse<GraphQLLinkageGroup[]>> {
    const constraints = [];
    if (geneticMap) {
        const geneticMapConstraint = intermineConstraint('LinkageGroup.geneticMap.id', '=', geneticMap.id);
        constraints.push(geneticMapConstraint);
    }
    const query = interminePathQuery(
        intermineLinkageGroupAttributes,
        intermineLinkageGroupSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
      .then((response: IntermineLinkageGroupResponse) => response2linkageGroups(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'LinkageGroup.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
