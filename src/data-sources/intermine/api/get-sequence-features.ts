import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  intermineOverlappingFeatureAttributes,
  intermineOverlappingFeatureSort,
  intermineSequenceFeatureChildFeatureAttributes,
  intermineSequenceFeatureChildFeatureSort,
  intermineSequenceFeatureQueryFormat,
  GraphQLSequenceFeature,
  IntermineSequenceFeatureResponse,
  response2sequenceFeatures,
} from '../models/index.js';
import {sequenceFeatureJoinFactory} from './sequence-feature.js';

// get SequenceFeatures using the given query and returns the expected GraphQL types
async function getSequenceFeatures(
  pathQuery: string,
): Promise<ApiResponse<GraphQLSequenceFeature>> {
  // get the data
  return this.pathQuery(
    pathQuery,
    {},
    intermineSequenceFeatureQueryFormat,
  ).then((response: IntermineSequenceFeatureResponse) => {
    const data = response2sequenceFeatures(response);
    return {data, metadata: {}};
  });
}

// get childFeatures (SequenceFeature) of a SequenceFeature
export async function getChildFeaturesForSequenceFeature(
  id: number,
): Promise<ApiResponse<GraphQLSequenceFeature>> {
  const constraints = [intermineConstraint('SequenceFeature.id', '=', id)];
  const joins = sequenceFeatureJoinFactory('SequenceFeature.childFeatures');
  const query = interminePathQuery(
    intermineSequenceFeatureChildFeatureAttributes,
    intermineSequenceFeatureChildFeatureSort,
    constraints,
    joins,
  );
  // get the data
  return getSequenceFeatures.call(this, query);
}

// get overlappingFeatures (SequenceFeatures) for a SequenceFeature
export async function getOverlappingFeaturesForSequenceFeature(
  id: number,
): Promise<ApiResponse<GraphQLSequenceFeature>> {
  const constraints = [intermineConstraint('SequenceFeature.id', '=', id)];
  const joins = sequenceFeatureJoinFactory(
    'SequenceFeature.overlappingFeatures',
  );
  const query = interminePathQuery(
    intermineOverlappingFeatureAttributes,
    intermineOverlappingFeatureSort,
    constraints,
    joins,
  );
  // get the data
  return getSequenceFeatures.call(this, query);
}
