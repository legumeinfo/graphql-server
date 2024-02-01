import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLOntologyAnnotation,
  IntermineOntologyAnnotationResponse,
  intermineOntologyAnnotationAttributes,
  intermineOntologyAnnotationSort,
  response2ontologyAnnotations,
} from '../models/index.js';

// get an OntologyAnnotation by ID
export async function getOntologyAnnotation(id: number):
Promise<ApiResponse<GraphQLOntologyAnnotation>> {
    const constraints = [intermineConstraint('OntologyAnnotation.id', '=', id)];
    const query = interminePathQuery(
        intermineOntologyAnnotationAttributes,
        intermineOntologyAnnotationSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineOntologyAnnotationResponse) => response2ontologyAnnotations(response))
        .then((ontologyAnnotations: Array<GraphQLOntologyAnnotation>) => {
            if (!ontologyAnnotations.length) return null;
            return ontologyAnnotations[0];
        })
        .then((ontologyAnnotation: GraphQLOntologyAnnotation) => ({data: ontologyAnnotation}));
}
