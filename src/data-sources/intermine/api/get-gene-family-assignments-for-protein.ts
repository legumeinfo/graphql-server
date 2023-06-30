import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
  GraphQLGeneFamilyAssignment,
  GraphQLProtein,
  IntermineGeneFamilyAssignmentResponse,
  intermineProteinGeneFamilyAssignmentsAttributes,
  intermineProteinGeneFamilyAssignmentsSort,
  response2geneFamilyAssignments,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


// get GeneFamilyAssignments for a Protein
export async function getGeneFamilyAssignmentsForProtein(
    protein: GraphQLProtein,
    {start, size}: PaginationOptions,
): Promise<ApiResponse<GraphQLGeneFamilyAssignment>> {
    const constraints = [intermineConstraint('Protein.id', '=', protein.id)];
    const query = interminePathQuery(
        intermineProteinGeneFamilyAssignmentsAttributes,
        intermineProteinGeneFamilyAssignmentsSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineGeneFamilyAssignmentResponse) => response2geneFamilyAssignments(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Protein.geneFamilyAssignments.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
