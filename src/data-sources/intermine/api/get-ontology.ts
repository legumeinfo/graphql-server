import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLOntology,
  IntermineOntologyResponse,
  intermineOntologyAttributes,
  intermineOntologySort,
  response2ontologies,
} from '../models/index.js';

// get an Ontology by name
export async function getOntology(name: string):
Promise<ApiResponse<GraphQLOntology>> {
    const constraints = [intermineConstraint('Ontology.name', '=', name)];
    const query = interminePathQuery(
        intermineOntologyAttributes,
        intermineOntologySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineOntologyResponse) => response2ontologies(response))
        .then((ontologies: Array<GraphQLOntology>) => {
            if (!ontologies.length) return null;
            return ontologies[0];
        })
        .then((ontology: GraphQLOntology) => ({data: ontology}));
}
