import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGWASResult,
    IntermineGWASResultResponse,
    intermineGWASResultAttributes,
    intermineGWASResultSort,
    response2gwasResults,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get GWASResults using the given constraints and returns the expected GraphQL types
async function getGWASResults(constraints: string[], { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGWASResult>> {
    const query = interminePathQuery(
        intermineGWASResultAttributes,
        intermineGWASResultSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGWASResultResponse) => response2gwasResults(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'GWASResult.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get GWASResults for a GWAS
export async function getGWASResultsForGWAS(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGWASResult>> {
    const constraints = [intermineConstraint('GWASResult.gwas.id', '=', id)];
    return getGWASResults.call(this, constraints, { page, pageSize });
}

// get GWASResults for a GeneticMarker
export async function getGWASResultsForGeneticMarker(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGWASResult>> {
    const constraints = [intermineConstraint('GWASResult.markers.id', '=', id)];
    return getGWASResults.call(this, constraints, { page, pageSize });
}

// get GWASResults for a Trait
export async function getGWASResultsForTrait(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGWASResult>> {
    const constraints = [intermineConstraint('GWASResult.trait.id', '=', id)];
    return getGWASResults.call(this, constraints, { page, pageSize });
}
