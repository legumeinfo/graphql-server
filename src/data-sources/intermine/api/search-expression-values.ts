import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo
} from '../intermine.server.js';
import {
    GraphQLExpressionValue,
    IntermineExpressionValueResponse,
    intermineExpressionValueAttributes,
    intermineExpressionValueSort,
    response2expressionValues,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchExpressionValuesOptions = {
    minValue?: number;
    geneIdentifier?: string;
    sampleIdentifier?: string;
} & PaginationOptions;


// path query search for ExpressionValue by minimum value and/or sample identifier and/or gene identifier
export async function searchExpressionValues(
    {
        minValue,
        geneIdentifier,
        sampleIdentifier,
        page,
        pageSize,
    }: SearchExpressionValuesOptions,
): Promise<ApiResponse<GraphQLExpressionValue[]>> {
    const constraints = [];
    if (minValue) {
        const constraint = intermineConstraint('ExpressionValue.value', '>=', minValue);
        constraints.push(constraint);
    }
    if (geneIdentifier) {
        const constraint = intermineConstraint('ExpressionValue.feature.primaryIdentifier', '=', geneIdentifier);
        constraints.push(constraint);
    }
    if (sampleIdentifier) {
        const constraint = intermineConstraint('ExpressionValue.sample.primaryIdentifier', '=', sampleIdentifier);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        intermineExpressionValueAttributes,
        intermineExpressionValueSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineExpressionValueResponse) => response2expressionValues(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
