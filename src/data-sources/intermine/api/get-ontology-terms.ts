import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLOntologyTerm,
  GraphQLTrait,
  IntermineOntologyTermResponse,
  intermineOntologyTermAttributes,
  intermineOntologyTermSort,
  response2ontologyTerms,
} from '../models/index.js';


export type GetOntologyTermsOptions = {
  trait?: GraphQLTrait;
}


// get OntologyTerms for a Trait
export async function getOntologyTerms({trait}: GetOntologyTermsOptions):
Promise<GraphQLOntologyTerm[]> {
    const constraints = [];
    if (trait) {
        const traitConstraint = intermineConstraint('Trait.id', '=', trait.id);
        constraints.push(traitConstraint);
    }
    const query = interminePathQuery(
        intermineOntologyTermAttributes,
        intermineOntologyTermSort,
        constraints,
    );
    return this.pathQuery(query)
      .then((response: IntermineOntologyTermResponse) => response2ontologyTerms(response));
}
