import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLSequence,
  IntermineSequenceResponse,
  intermineSequenceAttributes,
  intermineSequenceSort,
  response2sequences,
} from '../models/index.js';

// get a Sequence by id
export async function getSequence(
  id: number,
): Promise<ApiResponse<GraphQLSequence>> {
  const constraints = [intermineConstraint('Sequence.id', '=', id)];
  const query = interminePathQuery(
    intermineSequenceAttributes,
    intermineSequenceSort,
    constraints,
  );
  return this.pathQuery(query)
    .then((response: IntermineSequenceResponse) => response2sequences(response))
    .then((sequences: Array<GraphQLSequence>) => {
      if (!sequences.length) return null;
      return sequences[0];
    })
    .then((sequence: GraphQLSequence) => ({data: sequence}));
}
