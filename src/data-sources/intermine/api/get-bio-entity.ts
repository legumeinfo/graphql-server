import {
  ApiResponse,
  intermineConstraint,
  intermineJoin,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLBioEntity,
  IntermineBioEntityResponse,
  intermineBioEntityAttributes,
  intermineBioEntitySort,
  response2bioEntities,
} from '../models/index.js';

// get a BioEntity by id (for internal resolution only)
export async function getBioEntity(id: number):
Promise<ApiResponse<GraphQLBioEntity>> {
    const constraints = [intermineConstraint('BioEntity.id', '=', id)];
    // all BioEntity-extending object queries must include these joins
    const joins = [
        intermineJoin('BioEntity.organism', 'OUTER'),
        intermineJoin('BioEntity.strain', 'OUTER')
    ];
    const query = interminePathQuery(
        intermineBioEntityAttributes,
        intermineBioEntitySort,
        constraints,
        joins,
    );
    return this.pathQuery(query)
        .then((response: IntermineBioEntityResponse) => response2bioEntities(response))
        .then((bioentities: Array<GraphQLBioEntity>) => {
            if (!bioentities.length) return null;
            return bioentities[0];
        })
        .then((bioEntity: GraphQLBioEntity) => ({data: bioEntity}));
}
