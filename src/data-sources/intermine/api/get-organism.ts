import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLOrganism,
  IntermineOrganismResponse,
  intermineOrganismAttributes,
  intermineOrganismSort,
  response2organisms,
} from '../models/index.js';

// get an Organism by taxon ID
export async function getOrganism(
  taxonId: number,
): Promise<ApiResponse<GraphQLOrganism>> {
  const constraints = [intermineConstraint('Organism.taxonId', '=', taxonId)];
  const query = interminePathQuery(
    intermineOrganismAttributes,
    intermineOrganismSort,
    constraints,
  );
  return this.pathQuery(query)
    .then((response: IntermineOrganismResponse) => response2organisms(response))
    .then((organisms: Array<GraphQLOrganism>) => {
      if (!organisms.length) return null;
      return organisms[0];
    })
    .then((organism: GraphQLOrganism) => ({data: organism}));
}
