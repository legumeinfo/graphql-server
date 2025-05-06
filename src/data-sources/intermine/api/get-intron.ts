import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLIntron,
  IntermineIntronResponse,
  intermineIntronAttributes,
  intermineIntronSort,
  response2introns,
} from '../models/index.js';
import {sequenceFeatureJoinFactory} from './sequence-feature.js';

// get an Intron by identifier
export async function getIntron(
  identifier: string,
): Promise<ApiResponse<GraphQLIntron>> {
  const constraints = [
    intermineConstraint('Intron.primaryIdentifier', '=', identifier),
  ];
  const joins = sequenceFeatureJoinFactory('Intron');
  const query = interminePathQuery(
    intermineIntronAttributes,
    intermineIntronSort,
    constraints,
    joins,
  );
  return this.pathQuery(query)
    .then((response: IntermineIntronResponse) => response2introns(response))
    .then((introns: Array<GraphQLIntron>) => {
      if (!introns.length) return null;
      return introns[0];
    })
    .then((intron: GraphQLIntron) => ({data: intron}));
}
