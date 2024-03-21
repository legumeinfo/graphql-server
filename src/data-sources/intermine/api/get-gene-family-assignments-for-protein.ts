import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
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
    {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLGeneFamilyAssignment>> {
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
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
