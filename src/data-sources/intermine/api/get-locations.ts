import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLLocation,
  GraphQLBioEntity,
  IntermineLocationResponse,
  intermineLocationAttributes,
  intermineLocationSort,
  response2locations,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetLocationsOptions = {
  bioEntity?: GraphQLBioEntity;
} & PaginationOptions;

// get locations for any type that extends BioEntity
export async function getLocations(
    {bioEntity, page, pageSize}: GetLocationsOptions,
): Promise<ApiResponse<GraphQLLocation>> {
    const constraints = [
        intermineConstraint('Location.feature.id', '=', bioEntity.id)
    ];
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
