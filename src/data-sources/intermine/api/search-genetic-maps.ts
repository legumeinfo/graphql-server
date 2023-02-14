import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGeneticMap,
  IntermineGeneticMapResponse,
  intermineGeneticMapAttributes,
  intermineGeneticMapSort,
  response2geneticMaps,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type SearchGeneticMapsOptions = {
  description?: string;
} & PaginationOptions;


// path query search for GeneticMap by description
export async function searchGeneticMaps(
  {
    description,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: SearchGeneticMapsOptions,
): Promise<GraphQLGeneticMap[]> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('GeneticMap.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineGeneticMapAttributes,
        intermineGeneticMapSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineGeneticMapResponse) => response2geneticMaps(response));
}
