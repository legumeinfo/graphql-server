import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLOntologyTerm,
  IntermineOntologyTermResponse,
  intermineOntologyTermAttributes,
  intermineOntologyTermSort,
  response2ontologyTerms,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type SearchOntologyTermsOptions = {
  description?: string;
} & PaginationOptions;


// path query search for OntologyTerm by description
export async function searchOntologyTerms(
  {
    description,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: SearchOntologyTermsOptions,
): Promise<GraphQLOntologyTerm[]> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('OntologyTerm.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineOntologyTermAttributes,
        intermineOntologyTermSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineOntologyTermResponse) => response2ontologyTerms(response));
}
