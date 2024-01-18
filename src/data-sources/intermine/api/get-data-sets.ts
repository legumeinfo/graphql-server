import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLAnnotatable,
    GraphQLDataSet,
    GraphQLDataSource,
    IntermineDataSetResponse,
    intermineDataSetAttributes,
    intermineDataSetSort,
    response2dataSets,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetDataSetsOptions = {
    annotatable?: GraphQLAnnotatable;
    dataSource?: GraphQLDataSource;
} & PaginationOptions;

// get dataSets for an Annotatable or a DataSource
export async function getDataSets(
    {
        annotatable,
        dataSource,
        page,
        pageSize
    }: GetDataSetsOptions,
): Promise<ApiResponse<GraphQLDataSet>> {
    const constraints = [];
    if (annotatable) {
        constraints.push(intermineConstraint('DataSet.entities.id', '=', annotatable.id));
    }
    if (dataSource) {
        constraints.push(intermineConstraint('DataSet.dataSource.id', '=', dataSource.id));
    }
    // publication may be null
    const joins = [
        intermineJoin('DataSet.publication', 'OUTER'),
    ];
    const query = interminePathQuery(
        intermineDataSetAttributes,
        intermineDataSetSort,
        constraints,
        joins
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
