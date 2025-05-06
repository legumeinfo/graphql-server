import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLSupercontig,
  IntermineSupercontigResponse,
  intermineSupercontigAttributes,
  intermineSupercontigSort,
  response2supercontigs,
} from '../models/index.js';
import {sequenceFeatureJoinFactory} from './sequence-feature.js';

export async function getSupercontig(
  identifier: string,
): Promise<ApiResponse<GraphQLSupercontig>> {
  const constraints = [
    intermineConstraint('Supercontig.primaryIdentifier', '=', identifier),
  ];
  const joins = sequenceFeatureJoinFactory('Supercontig');
  const query = interminePathQuery(
    intermineSupercontigAttributes,
    intermineSupercontigSort,
    constraints,
    joins,
  );
  return this.pathQuery(query)
    .then((response: IntermineSupercontigResponse) =>
      response2supercontigs(response),
    )
    .then((supercontigs: Array<GraphQLSupercontig>) => {
      if (!supercontigs.length) return null;
      return supercontigs[0];
    })
    .then((supercontig: GraphQLSupercontig) => ({data: supercontig}));
}
