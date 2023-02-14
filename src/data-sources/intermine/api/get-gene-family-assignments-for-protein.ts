import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneFamilyAssignment,
  GraphQLProtein,
  IntermineGeneFamilyAssignmentResponse,
  intermineProteinGeneFamilyAssignmentsAttributes,
  intermineProteinGeneFamilyAssignmentsSort,
  response2geneFamilyAssignments,
} from '../models/index.js';


// get GeneFamilyAssignments for a Protein
export async function getGeneFamilyAssignmentsForProtein(protein: GraphQLProtein): Promise<GraphQLGeneFamilyAssignment> {
    const constraints = [intermineConstraint('Protein.id', '=', protein.id)];
    const query = interminePathQuery(
        intermineProteinGeneFamilyAssignmentsAttributes,
        intermineProteinGeneFamilyAssignmentsSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneFamilyAssignmentResponse) => response2geneFamilyAssignments(response));
}
