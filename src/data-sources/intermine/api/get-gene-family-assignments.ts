import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGene,
  GraphQLGeneFamilyAssignment,
  IntermineGeneFamilyAssignmentResponse,
  intermineGeneGeneFamilyAssignmentsAttributes,
  intermineGeneGeneFamilyAssignmentsSort,
  response2geneFamilyAssignments,
} from '../models/index.js';


// get GeneFamilyAssignments for a Gene
export async function getGeneFamilyAssignments(gene: GraphQLGene): Promise<GraphQLGeneFamilyAssignment[]> {
    const constraints = [intermineConstraint('Gene.id', '=', gene.id)];
    const query = interminePathQuery(
        intermineGeneGeneFamilyAssignmentsAttributes,
        intermineGeneGeneFamilyAssignmentsSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineGeneFamilyAssignmentResponse) => response2geneFamilyAssignments(response));
}
