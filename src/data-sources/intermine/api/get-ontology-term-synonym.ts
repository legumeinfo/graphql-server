import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLOntologyTermSynonym,
  IntermineOntologyTermSynonymResponse,
  intermineOntologyTermSynonymAttributes,
  intermineOntologyTermSynonymSort,
  response2ontologyTermSynonyms,
} from '../models/index.js';

// get an OntologyTermSynonym by name
export async function getOntologyTermSynonym(
  name: string,
): Promise<ApiResponse<GraphQLOntologyTermSynonym>> {
  const constraints = [
    intermineConstraint('OntologyTermSynonym.name', '=', name),
  ];
  const query = interminePathQuery(
    intermineOntologyTermSynonymAttributes,
    intermineOntologyTermSynonymSort,
    constraints,
  );
  return this.pathQuery(query)
    .then((response: IntermineOntologyTermSynonymResponse) =>
      response2ontologyTermSynonyms(response),
    )
    .then((ontologyTermSynonyms: Array<GraphQLOntologyTermSynonym>) => {
      if (!ontologyTermSynonyms.length) return null;
      return ontologyTermSynonyms[0];
    })
    .then((ontologyTermSynonym: GraphQLOntologyTermSynonym) => ({
      data: ontologyTermSynonym,
    }));
}
