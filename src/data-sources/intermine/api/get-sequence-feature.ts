import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLSequenceFeature,
  IntermineSequenceFeatureResponse,
  intermineSequenceFeatureAttributes,
  intermineSequenceFeatureQueryFormat,
  intermineSequenceFeatureSort,
  response2sequenceFeatures,
} from '../models/index.js';
import {sequenceFeatureJoinFactory} from './sequence-feature.js';

// get an SequenceFeature by id (for internal resolution of collections and references)
export async function getSequenceFeature(
  id: number,
): Promise<ApiResponse<GraphQLSequenceFeature>> {
  const constraints = [intermineConstraint('SequenceFeature.id', '=', id)];
  const joins = sequenceFeatureJoinFactory();
  const query = interminePathQuery(
    intermineSequenceFeatureAttributes,
    intermineSequenceFeatureSort,
    constraints,
    joins,
  );
  return this.pathQuery(query, {}, intermineSequenceFeatureQueryFormat)
    .then((response: IntermineSequenceFeatureResponse) =>
      response2sequenceFeatures(response),
    )
    .then((sequenceFeatures: Array<GraphQLSequenceFeature>) => {
      if (!sequenceFeatures.length) return null;
      return sequenceFeatures[0];
    })
    .then((sequenceFeature: GraphQLSequenceFeature) => ({
      data: sequenceFeature,
    }));
}
