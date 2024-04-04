import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGeneFamilyAssignment,
    IntermineGeneFamilyAssignmentResponse,
    intermineGeneGeneFamilyAssignmentsAttributes,
    intermineGeneGeneFamilyAssignmentsSort,
    intermineProteinGeneFamilyAssignmentsAttributes,
    intermineProteinGeneFamilyAssignmentsSort,
    response2geneFamilyAssignments,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get GeneFamilyAssignments using the given query and returns the expected GraphQL types
async function getGeneFamilyAssignments(pathQuery: string, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGeneFamilyAssignment>> {
    // get the data
    const dataPromise = this.pathQuery(pathQuery, {page, pageSize})
        .then((response: IntermineGeneFamilyAssignmentResponse) => response2geneFamilyAssignments(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(pathQuery, {summaryPath: 'Gene.geneFamilyAssignments.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get GeneFamilyAssignments for a Gene
export async function getGeneFamilyAssignmentsForGene(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGeneFamilyAssignment>> {
    const constraints = [intermineConstraint('Gene.id', '=', id)];
    const query = interminePathQuery(
        intermineGeneGeneFamilyAssignmentsAttributes,
        intermineGeneGeneFamilyAssignmentsSort,
        constraints,
    );
    // get the data
    return getGeneFamilyAssignments(query, { page, pageSize });
}

// get GeneFamilyAssignments for a Protein
export async function getGeneFamilyAssignmentsForProtein(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLGeneFamilyAssignment>> {
    const constraints = [intermineConstraint('Protein.id', '=', id)];
    const query = interminePathQuery(
        intermineProteinGeneFamilyAssignmentsAttributes,
        intermineProteinGeneFamilyAssignmentsSort,
        constraints,
    );
    // get the data
    return getGeneFamilyAssignments(query, { page, pageSize });
}
