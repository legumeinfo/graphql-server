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
  IntermineGeneFamilyAssignmentResponse,
  intermineGeneGeneFamilyAssignmentsAttributes,
  intermineGeneGeneFamilyAssignmentsSort,
  response2geneFamilyAssignments,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


// get GeneFamilyAssignments for a Gene
export async function getGeneFamilyAssignments(
    gene: GraphQLGene,
    {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGeneFamilyAssignment[]>> {
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
}
