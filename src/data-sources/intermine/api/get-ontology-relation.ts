import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLOntologyRelation,
  IntermineOntologyRelationResponse,
  intermineOntologyRelationAttributes,
  intermineOntologyRelationSort,
  response2ontologyRelations,
} from '../models/index.js';

// get an OntologyRelation by name
export async function getOntologyRelation(name: string):
Promise<ApiResponse<GraphQLOntologyRelation>> {
    const constraints = [intermineConstraint('OntologyRelation.name', '=', name)];
    const query = interminePathQuery(
        intermineOntologyRelationAttributes,
        intermineOntologyRelationSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineOntologyRelationResponse) => response2ontologyRelations(response))
        .then((ontologyRelations: Array<GraphQLOntologyRelation>) => {
            if (!ontologyRelations.length) return null;
            return ontologyRelations[0];
        })
        .then((ontologyRelation: GraphQLOntologyRelation) => ({data: ontologyRelation}));
}
