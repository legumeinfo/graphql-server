import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLAnnotatable,
    GraphQLDataSet,
    IntermineDataSetResponse,
    intermineDataSetAttributes,
    intermineDataSetSort,
    response2dataSets,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetDataSetsOptions = {
    annotatable?: GraphQLAnnotatable;
} & PaginationOptions;

// get dataSets for types that extend Annotatable using entities reverse reference
export async function getDataSets(
    {annotatable, page, pageSize}: GetDataSetsOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [
        intermineConstraint('DataSet.entities.id', '=', annotatable.id)
    ];
    const query = interminePathQuery(
        intermineDataSetAttributes,
        intermineDataSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineDataSetResponse) => response2dataSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'DataSet.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
