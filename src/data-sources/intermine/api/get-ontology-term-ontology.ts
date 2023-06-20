import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLOntology,
  GraphQLOntologyTerm,
  IntermineOntologyTermOntologyResponse,
  intermineOntologyTermOntologyAttributes,
  intermineOntologyTermOntologySort,
  response2ontologies,
} from '../models/index.js';


// get the Ontology of an OntologyTerm
export async function getOntologyTermOntology(ontologyTerm: GraphQLOntologyTerm):
Promise<ApiResponse<GraphQLOntology|null>> {
    const constraints = [ intermineConstraint('OntologyTerm.id', '=', ontologyTerm.id) ];
    const query = interminePathQuery(
        intermineOntologyTermOntologyAttributes,
        intermineOntologyTermOntologySort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineOntologyTermOntologyResponse) => response2ontologies(response))
        .then((ontologies: Array<GraphQLOntology>) => {
            if (!ontologies.length) {
                // TODO: what's the best way to handle this?
                // no ontology reference, return a placeholder
                //return {
                //    'id': 0,
                //    'url': null,
                //    'name': null,
                //}
                return null;
            } else {
                return ontologies[0];
            }
        })
        .then((ontology: GraphQLOntology) => ({data: ontology}));
}
