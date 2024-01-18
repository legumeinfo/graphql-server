import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    GraphQLGeneFamilyAssignment,
    GraphQLProtein,
    IntermineGeneFamilyAssignmentResponse,
    intermineGeneGeneFamilyAssignmentsAttributes,
    intermineGeneGeneFamilyAssignmentsSort,
    intermineProteinGeneFamilyAssignmentsAttributes,
    intermineProteinGeneFamilyAssignmentsSort,
    response2geneFamilyAssignments,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetGeneFamilyAssignmentsOptions = {
    gene?: GraphQLGene;
    protein?: GraphQLProtein;
} & PaginationOptions;

// get GeneFamilyAssignments for a Gene or Protein
export async function getGeneFamilyAssignments(
    {
        gene,
        protein,
        page,
        pageSize,
    }: GetGeneFamilyAssignmentsOptions,
): Promise<ApiResponse<GraphQLGeneFamilyAssignment[]>> {
    if (gene) {
        const constraints = [intermineConstraint('Gene.id', '=', gene.id)];
        const query = interminePathQuery(
            intermineGeneGeneFamilyAssignmentsAttributes,
            intermineGeneGeneFamilyAssignmentsSort,
            constraints,
        );
        // get the data
        const dataPromise = this.pathQuery(query, {page, pageSize})
            .then((response: IntermineGeneFamilyAssignmentResponse) => response2geneFamilyAssignments(response));
        // get a summary of the data and convert it to page info
        const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Gene.geneFamilyAssignments.id'})
            .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
        // return the expected GraphQL type
        return Promise.all([dataPromise, pageInfoPromise])
            .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
    } else if (protein) { 
        const constraints = [intermineConstraint('Protein.id', '=', protein.id)];
        const query = interminePathQuery(
            intermineProteinGeneFamilyAssignmentsAttributes,
            intermineProteinGeneFamilyAssignmentsSort,
            constraints,
        );
        // get the data
        const dataPromise = this.pathQuery(query, {page, pageSize})
            .then((response: IntermineGeneFamilyAssignmentResponse) => response2geneFamilyAssignments(response));
        // get a summary of the data and convert it to page info
        const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Protein.geneFamilyAssignments.id'})
            .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
        // return the expected GraphQL type
        return Promise.all([dataPromise, pageInfoPromise])
            .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
    } else {
        return null;
    }
}
