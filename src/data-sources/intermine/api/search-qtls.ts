import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLQTL,
    IntermineQTLResponse,
    intermineQTLAttributes,
    intermineQTLSort,
    response2qtls,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchQTLsOptions = {
    traitName?: string;
} & PaginationOptions;


// path query search for QTLs by Trait.name
export async function searchQTLs(
    {
        traitName,
        start,
        size,
    }: SearchQTLsOptions,
): Promise<ApiResponse<GraphQLQTL[]>> {
    const constraints = [];
    if (traitName) {
        const constraint = intermineConstraint('QTL.trait.name', 'CONTAINS', traitName);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        intermineQTLAttributes,
        intermineQTLSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineQTLResponse) => response2qtls(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'QTL.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
