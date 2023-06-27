import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLLocation,
  GraphQLSequenceFeature,
  IntermineLocationResponse,
  intermineLocationAttributes,
  intermineLocationSort,
  response2locations,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetLocationsOptions = {
  sequenceFeature?: GraphQLSequenceFeature;
} & PaginationOptions;


// get Locations for any type that extends SequenceFeature
export async function getLocations(
    {sequenceFeature, page, pageSize}: GetLocationsOptions,
): Promise<ApiResponse<GraphQLLocation>> {
    const constraints = [];
    if (sequenceFeature) {
        const constraint = intermineConstraint('Location.feature.id', '=', sequenceFeature.id);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        intermineLocationAttributes,
        intermineLocationSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
      .then((response: IntermineLocationResponse) => response2locations(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Location.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
