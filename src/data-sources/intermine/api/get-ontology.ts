import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLOntology,
  IntermineOntologyResponse,
  intermineOntologyAttributes,
  intermineOntologySort,
  response2ontologies,
} from '../models/index.js';


// get an Ontology by ID
export async function getOntology(id: number): Promise<GraphQLOntology> {
    const constraints = [intermineConstraint('Ontology.id', '=', id)];
    const query = interminePathQuery(
        intermineOntologyAttributes,
        intermineOntologySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineOntologyResponse) => response2ontologies(response))
        .then((ontologies: Array<GraphQLOntology>) => {
            if (!ontologies.length) {
                const msg = `Ontology with ID '${id}' not found`;
                this.inputError(msg);
            }
            return ontologies[0];
        });
}
