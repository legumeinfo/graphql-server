import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLBioEntity,
  IntermineBioEntityResponse,
  intermineBioEntityAttributes,
  intermineBioEntitySort,
  response2bioEntities,
} from '../models/index.js';


// get a BioEntity by identifier
export async function getBioEntity(identifier: string):
Promise<ApiResponse<GraphQLBioEntity>> {
    const constraints = [intermineConstraint('BioEntity.primaryIdentifier', '=', identifier)];
    const query = interminePathQuery(
        intermineBioEntityAttributes,
        intermineBioEntitySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineBioEntityResponse) => response2bioEntities(response))
        .then((bioentities: Array<GraphQLBioEntity>) => {
            if (!bioentities.length) return null;
            return bioentities[0];
        })
        .then((bioEntity: GraphQLBioEntity) => ({data: bioEntity}));
}
