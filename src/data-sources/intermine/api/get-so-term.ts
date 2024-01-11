import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLOntologyTerm,
  IntermineOntologyTermResponse,
  intermineSOTermAttributes,
  intermineSOTermSort,
  response2ontologyTerms,
} from '../models/index.js';

// get an SOTerm (an OntologyTerm stored separately) by identifier
export async function getSOTerm(identifier: string):
Promise<ApiResponse<GraphQLOntologyTerm>> {
    const constraints = [intermineConstraint('SOTerm.identifier', '=', (identifier === null) ? '' : identifier)];
    const query = interminePathQuery(
        intermineSOTermAttributes,
        intermineSOTermSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineOntologyTermResponse) => response2ontologyTerms(response))
        .then((ontologyTerms: Array<GraphQLOntologyTerm>) => {
            if (!ontologyTerms.length) return null;
            return ontologyTerms[0];
        })
        .then((ontologyTerm: GraphQLOntologyTerm) => ({data: ontologyTerm}));
}
