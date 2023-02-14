import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLProtein,
  IntermineProteinResponse,
  intermineProteinAttributes,
  intermineProteinSort,
  response2proteins,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type SearchProteinsOptions = {
  description?: string;
} & PaginationOptions;


// path query search for Protein by description
export async function searchProteins(
  {
    description,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: SearchProteinsOptions,
): Promise<GraphQLProtein[]> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('Protein.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineProteinAttributes,
        intermineProteinSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineProteinResponse) => response2proteins(response));
}
