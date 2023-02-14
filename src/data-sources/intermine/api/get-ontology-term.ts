import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLOntologyTerm,
  IntermineOntologyTermResponse,
  intermineOntologyTermAttributes,
  intermineOntologyTermSort,
  response2ontologyTerms,
} from '../models/index.js';


// get an OntologyTerm by ID
export async function getOntologyTerm(id: number): Promise<GraphQLOntologyTerm> {
    const constraints = [intermineConstraint('OntologyTerm.id', '=', id)];
    const query = interminePathQuery(
        intermineOntologyTermAttributes,
        intermineOntologyTermSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineOntologyTermResponse) => response2ontologyTerms(response))
        .then((ontologyTerms: Array<GraphQLOntologyTerm>) => {
            if (!ontologyTerms.length) {
                const msg = `OntologyTerm with ID '${id}' not found`;
                this.inputError(msg);
            }
            return ontologyTerms[0];
        });
}
