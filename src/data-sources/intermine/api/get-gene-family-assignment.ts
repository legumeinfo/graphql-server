import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneFamilyAssignment,
  IntermineGeneFamilyAssignmentResponse,
  intermineGeneFamilyAssignmentAttributes,
  intermineGeneFamilyAssignmentSort,
  response2geneFamilyAssignments,
} from '../models/index.js';


// get a GeneFamilyAssignment by ID
export async function getGeneFamilyAssignment(id: number): Promise<GraphQLGeneFamilyAssignment> {
    const constraints = [intermineConstraint('GeneFamilyAssignment.id', '=', id)];
    const query = interminePathQuery(
        intermineGeneFamilyAssignmentAttributes,
        intermineGeneFamilyAssignmentSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneFamilyAssignmentResponse) => response2geneFamilyAssignments(response))
	.then((geneFamilyAssignments: Array<GraphQLGeneFamilyAssignment>) => {
            if (!geneFamilyAssignments.length) return null;
            return geneFamilyAssignments[0];
        });
}
