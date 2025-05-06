import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLIntergenicRegion,
  IntermineIntergenicRegionResponse,
  intermineIntergenicRegionAttributes,
  intermineIntergenicRegionSort,
  response2intergenicRegions,
} from '../models/index.js';
import {sequenceFeatureJoinFactory} from './sequence-feature.js';

// get an IntergenicRegion by identifier
export async function getIntergenicRegion(
  identifier: string,
): Promise<ApiResponse<GraphQLIntergenicRegion>> {
  const constraints = [
    intermineConstraint('IntergenicRegion.primaryIdentifier', '=', identifier),
  ];
  const joins = sequenceFeatureJoinFactory('IntergenicRegion');
  const query = interminePathQuery(
    intermineIntergenicRegionAttributes,
    intermineIntergenicRegionSort,
    constraints,
    joins,
  );
  return this.pathQuery(query)
    .then((response: IntermineIntergenicRegionResponse) =>
      response2intergenicRegions(response),
    )
    .then((intergenicRegions: Array<GraphQLIntergenicRegion>) => {
      if (!intergenicRegions.length) return null;
      return intergenicRegions[0];
    })
    .then((intron: GraphQLIntergenicRegion) => ({data: intron}));
}
