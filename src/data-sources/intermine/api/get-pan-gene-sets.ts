import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLPanGeneSet,
    InterminePanGeneSetResponse,
    interminePanGeneSetAttributes,
    interminePanGeneSetSort,
    response2panGeneSets,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get PanGeneSets for a Gene
export async function getPanGeneSetsForGene(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLPanGeneSet>> {
    const constraints = [intermineConstraint('PanGeneSet.genes.id', '=', id)];
    const query = interminePathQuery(
        interminePanGeneSetAttributes,
        interminePanGeneSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: InterminePanGeneSetResponse) => response2panGeneSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'PanGeneSet.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get PanGeneSets for a Transcript
export async function getPanGeneSetsForTranscript(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLPanGeneSet>> {
    const constraints = [intermineConstraint('PanGeneSet.transcripts.id', '=', id)];
    const query = interminePathQuery(
        interminePanGeneSetAttributes,
        interminePanGeneSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: InterminePanGeneSetResponse) => response2panGeneSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'PanGeneSet.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get PanGeneSets for a Protein
export async function getPanGeneSetsForProtein(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLPanGeneSet>> {
    const constraints = [intermineConstraint('PanGeneSet.proteins.id', '=', id)];
    const query = interminePathQuery(
        interminePanGeneSetAttributes,
        interminePanGeneSetSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: InterminePanGeneSetResponse) => response2panGeneSets(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'PanGeneSet.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
