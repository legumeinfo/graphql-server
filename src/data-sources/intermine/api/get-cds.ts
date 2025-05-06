import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLCDS,
  IntermineCDSResponse,
  intermineCDSAttributes,
  intermineCDSSort,
  response2cdss,
} from '../models/index.js';
import {sequenceFeatureJoinFactory} from './sequence-feature.js';

// get a CDS by identifier
export async function getCDS(
  identifier: string,
): Promise<ApiResponse<GraphQLCDS>> {
  const constraints = [
    intermineConstraint('CDS.primaryIdentifier', '=', identifier),
  ];
  const joins = sequenceFeatureJoinFactory('CDS');
  const query = interminePathQuery(
    intermineCDSAttributes,
    intermineCDSSort,
    constraints,
    joins,
  );
  return this.pathQuery(query)
    .then((response: IntermineCDSResponse) => response2cdss(response))
    .then((cdss: Array<GraphQLCDS>) => {
      if (!cdss.length) return null;
      return cdss[0];
    })
    .then((cds: GraphQLCDS) => ({data: cds}));
}
