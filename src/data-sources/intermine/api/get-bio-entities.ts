import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineJoin,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLBioEntity,
    GraphQLDataSet,
    IntermineBioEntityResponse,
    intermineBioEntityAttributes,
    intermineBioEntitySort,
    response2bioEntities,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetBioEntitiesOptions = {
    dataSet?: GraphQLDataSet;
} & PaginationOptions;

// get BioEntity objects associated with a DataSet
export async function getBioEntities(
    {
        dataSet,
        page,
        pageSize
    }: GetBioEntitiesOptions,
): Promise<ApiResponse<GraphQLBioEntity>> {
    const constraints = [];
    if (dataSet) {
        constraints.push(intermineConstraint('BioEntity.dataSets.id', '=', dataSet.id));
    }
    // all BioEntity-extending object queries must include these joins
    const joins = [
        intermineJoin('BioEntity.organism', 'OUTER'),
        intermineJoin('BioEntity.strain', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineBioEntityAttributes,
        intermineBioEntitySort,
        constraints,
        joins
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineBioEntityResponse) => response2bioEntities(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'BioEntity.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
